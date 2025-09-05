import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Grid,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Class, CreateClassRequest, UpdateClassRequest, CLASS_LEVELS, CLASS_SECTIONS, ACADEMIC_YEARS } from '../../../types/class';

interface ClassFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClassRequest | UpdateClassRequest) => void;
  classData?: Class;
  isLoading?: boolean;
  error?: string | null;
}

const validationSchema = yup.object({
  name: yup.string().required('Le nom de la classe est requis'),
  level: yup.string().required('Le niveau est requis'),
  section: yup.string().required('La section est requise'),
  description: yup.string().optional(),
  academic_year: yup.string().required('L\'année académique est requise'),
  max_students: yup.number()
    .required('Le nombre maximum d\'étudiants est requis')
    .min(1, 'Le nombre minimum d\'étudiants doit être 1')
    .max(50, 'Le nombre maximum d\'étudiants ne peut pas dépasser 50'),
  is_active: yup.boolean().required()
});

const ClassForm: React.FC<ClassFormProps> = ({
  open,
  onClose,
  onSubmit,
  classData,
  isLoading = false,
  error
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<CreateClassRequest>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: classData?.name || '',
      level: classData?.level || '',
      section: classData?.section || '',
      description: '',
      academic_year: classData?.academic_year || '2024-2025',
      max_students: classData?.max_students || 25,
      is_active: classData?.is_active ?? true
    }
  });

  React.useEffect(() => {
    if (classData) {
      reset({
        name: classData.name,
        level: classData.level,
        section: classData.section,
        description: '',
        academic_year: classData.academic_year,
        max_students: classData.max_students,
        is_active: classData.is_active
      });
    } else {
      reset({
        name: '',
        level: '',
        section: '',
        description: '',
        academic_year: '2024-2025',
        max_students: 25,
        is_active: true
      });
    }
  }, [classData, reset]);

  const handleFormSubmit = (data: CreateClassRequest | UpdateClassRequest) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {classData ? 'Modifier la Classe' : 'Créer une Nouvelle Classe'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nom de la Classe"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    placeholder="Ex: CM1, 6ème, Seconde"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.level}>
                    <InputLabel>Niveau</InputLabel>
                    <Select {...field} label="Niveau">
                      {CLASS_LEVELS.map((level) => (
                        <MenuItem key={level.value} value={level.value}>
                          {level.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.level && (
                      <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                        {errors.level.message}
                      </Box>
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
                  <FormControl fullWidth error={!!errors.section}>
                    <InputLabel>Section</InputLabel>
                    <Select {...field} label="Section">
                      {CLASS_SECTIONS.map((section) => (
                        <MenuItem key={section.value} value={section.value}>
                          {section.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.section && (
                      <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                        {errors.section.message}
                      </Box>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="academic_year"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.academic_year}>
                    <InputLabel>Année Académique</InputLabel>
                    <Select {...field} label="Année Académique">
                      {ACADEMIC_YEARS.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.academic_year && (
                      <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                        {errors.academic_year.message}
                      </Box>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="max_students"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre Maximum d'Étudiants"
                    type="number"
                    fullWidth
                    error={!!errors.max_students}
                    helperText={errors.max_students?.message}
                    inputProps={{ min: 1, max: 50 }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description (Optionnel)"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    placeholder="Description de la classe..."
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        color="primary"
                      />
                    }
                    label="Classe Active"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Enregistrement...' : (classData ? 'Modifier' : 'Créer')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ClassForm;
