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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../../features/store';
import { StudentFormData } from '../../../types/student';

interface StudentFormProps {
  initialData?: Partial<StudentFormData>;
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const validationSchema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  student_id: yup.string().required('Student ID is required'),
  school: yup.string().required('School is required'),
  class_level: yup.string().required('Class level is required'),
  section: yup.string().required('Section is required'),
  gender: yup.string().required('Gender is required'),
  date_of_birth: yup.string().required('Date of birth is required'),
  enrollment_date: yup.string().required('Enrollment date is required'),
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
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      student_id: '',
      school: school?.id || '', // Use optional chaining
      class_level: '',
      section: '',
      gender: '',
      date_of_birth: '',
      enrollment_date: '',
      ...initialData,
    },
  });
  
  // If no school data, show error
  if (!school) {
    return (
      <Box>
        <Typography color="error" variant="body1">
          School information not available. Please contact your administrator.
        </Typography>
      </Box>
    );
  }

  const classLevels = [
    'Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th',
    '9th', '10th', '11th', '12th', 'Licence 1', 'Licence 2', 'Licence 3',
    'Master 1', 'Master 2'
  ];

  const sections = ['A', 'B', 'C', 'D', 'E', 'F'];
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
        {isEdit ? 'Edit Student' : 'Add New Student'}
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
                label="First Name"
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
                 label="Last Name"
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
                 label="Student ID"
                 placeholder="School provided ID"
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
                 label="School"
                 value={school.name}
                 disabled
                 size="small"
                 helperText="Your assigned school"
               />
             )}
           />
         </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="class_level"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.class_level}>
                <InputLabel>Class Level</InputLabel>
                <Select {...field} label="Class Level">
                  {classLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
                {errors.class_level && (
                  <Typography color="error" variant="caption">
                    {errors.class_level.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="section"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.section}>
                <InputLabel>Section</InputLabel>
                <Select {...field} label="Section">
                  {sections.map((section) => (
                    <MenuItem key={section} value={section}>
                      {section}
                    </MenuItem>
                  ))}
                </Select>
                {errors.section && (
                  <Typography color="error" variant="caption">
                    {errors.section.message}
                  </Typography>
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
                 <InputLabel>Gender</InputLabel>
                 <Select {...field} label="Gender">
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
                 label="Date of Birth"
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
                label="Enrollment Date"
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
          {isLoading ? 'Saving...' : (isEdit ? 'Update Student' : 'Add Student')}
        </Button>
      </Box>
    </Box>
  );
};

export default StudentForm;
