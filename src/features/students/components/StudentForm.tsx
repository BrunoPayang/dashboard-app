import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../../features/store';
import { StudentFormData } from '../../../types/student';
import { useGetClassesForDropdownQuery } from '../../classes/classApi';
import { useCurrentSchool } from '../../../hooks/useCurrentSchool';

interface StudentFormProps {
  initialData?: Partial<StudentFormData>;
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const validationSchema = yup.object({
  first_name: yup.string().required('Le prénom est requis'),
  last_name: yup.string().required('Le nom est requis'),
  student_id: yup.string().required('L\'ID étudiant est requis'),
  school: yup.string().required('L\'école est requise'),
  class_assigned: yup.string().required('La classe est requise'),
  gender: yup.string().required('Le genre est requis'),
  date_of_birth: yup.string().required('La date de naissance est requise'),
  enrollment_date: yup.string().required('La date d\'inscription est requise'),
});

const StudentForm: React.FC<StudentFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) => {
  // Call ALL hooks FIRST, before any conditional logic
  const { school } = useSelector((state: RootState) => state.auth);
  const { school: currentSchool } = useCurrentSchool();
  
  // Fetch classes for dropdown
  const {
    data: classes = [],
    isLoading: classesLoading,
    error: classesError
  } = useGetClassesForDropdownQuery({
    school: currentSchool?.id || school?.id,
    is_active: true
  });
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      student_id: '',
      school: school?.id || '', // Use optional chaining
      class_assigned: '',
      gender: '',
      date_of_birth: '',
      enrollment_date: '',
      ...initialData,
    },
  });

  // Reset form when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        student_id: initialData.student_id || '',
        school: initialData.school || school?.id || '',
        class_assigned: initialData.class_assigned || '',
        gender: initialData.gender || '',
        date_of_birth: initialData.date_of_birth || '',
        enrollment_date: initialData.enrollment_date || '',
      });
    }
  }, [initialData, reset, school?.id]);
  
  // If no school data, show error
  if (!school) {
    return (
      <Box>
        <Typography color="error" variant="body1">
          Informations de l'école non disponibles. Veuillez contacter votre administrateur.
        </Typography>
      </Box>
    );
  }

  const genders = ['male', 'female', 'other'];

  const handleFormSubmit = (data: StudentFormData) => {
    // Log the form data being submitted for debugging
    console.log('Submitting student form data:', data);
    console.log('User school data:', school);
    
    // Ensure the school ID is properly set
    const formDataWithSchool = {
      ...data,
      school: school.id
    };
    
    console.log('Final form data with school:', formDataWithSchool);
    onSubmit(formDataWithSchool);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Modifier l\'Étudiant' : 'Ajouter un Nouvel Étudiant'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Prénom"
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                size="small"
              />
            )}
          />
        </Grid>

                 <Grid item xs={12} sm={6}>
           <Controller
             name="last_name"
             control={control}
             render={({ field }) => (
               <TextField
                 {...field}
                 fullWidth
                                 label="Nom"
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
                 size="small"
               />
             )}
           />
         </Grid>

         <Grid item xs={12} sm={6}>
           <Controller
             name="student_id"
             control={control}
             render={({ field }) => (
               <TextField
                 {...field}
                 fullWidth
                                 label="ID Étudiant"
                placeholder="ID fourni par l\'école"
                error={!!errors.student_id}
                helperText={errors.student_id?.message}
                 size="small"
               />
             )}
           />
         </Grid>

                 <Grid item xs={12} sm={6}>
           <Controller
             name="school"
             control={control}
             render={({ field }) => (
               <TextField
                 {...field}
                 fullWidth
                                 label="École"
                value={school.name}
                disabled
                size="small"
                helperText="Votre école assignée"
               />
             )}
           />
         </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="class_assigned"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.class_assigned}>
                <InputLabel>Classe</InputLabel>
                <Select {...field} label="Classe" disabled={classesLoading}>
                  {classesLoading ? (
                    <MenuItem disabled>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography>Chargement des classes...</Typography>
                      </Box>
                    </MenuItem>
                  ) : classesError ? (
                    <MenuItem disabled>
                      <Typography color="error">Erreur lors du chargement des classes</Typography>
                    </MenuItem>
                  ) : classes.length === 0 ? (
                    <MenuItem disabled>
                      <Typography color="textSecondary">Aucune classe disponible</Typography>
                    </MenuItem>
                  ) : (
                    classes.map((classItem) => (
                      <MenuItem key={classItem.id} value={classItem.id}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {classItem.full_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {classItem.academic_year} • {classItem.student_count}/{classItem.max_students} étudiants
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.class_assigned && (
                  <Typography color="error" variant="caption">
                    {errors.class_assigned.message}
                  </Typography>
                )}
                {classesError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Erreur lors du chargement des classes. Veuillez réessayer.
                  </Alert>
                )}
              </FormControl>
            )}
          />
        </Grid>

                 <Grid item xs={12} sm={6}>
           <Controller
             name="gender"
             control={control}
             render={({ field }) => (
               <FormControl fullWidth size="small" error={!!errors.gender}>
                                 <InputLabel>Genre</InputLabel>
                <Select {...field} label="Genre">
                   {genders.map((gender) => (
                     <MenuItem key={gender} value={gender}>
                       {gender.charAt(0).toUpperCase() + gender.slice(1)}
                     </MenuItem>
                   ))}
                 </Select>
                 {errors.gender && (
                   <Typography color="error" variant="caption">
                     {errors.gender.message}
                   </Typography>
                 )}
               </FormControl>
             )}
           />
         </Grid>

         <Grid item xs={12} sm={6}>
           <Controller
             name="date_of_birth"
             control={control}
             render={({ field }) => (
               <TextField
                 {...field}
                 fullWidth
                                 label="Date de Naissance"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth?.message}
                 size="small"
               />
             )}
           />
         </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="enrollment_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Date d\'Inscription"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.enrollment_date}
                helperText={errors.enrollment_date?.message}
                size="small"
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour l\'Étudiant' : 'Ajouter l\'Étudiant')}
        </Button>
      </Box>
    </Box>
  );
};

export default StudentForm;
