import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  useCreateBehaviorReportMutation,
  useUpdateBehaviorReportMutation 
} from '../../../services/api/academicApi';
import { useGetStudentsQuery } from '../../students/studentApi';
import type { Student } from '../../../types/student';

import type { 
  BehaviorReport, 
  CreateBehaviorReportRequest
} from '../../../types/academic';

const schema = yup.object({
  student: yup.mixed<string | number>()
    .required('Étudiant requis')
    .test('not-empty', 'Veuillez sélectionner un étudiant', (value) => {
      return value !== '' && value !== null && value !== undefined;
    }),
  report_type: yup.string().required('Type de rapport requis'),
  title: yup.string().required('Titre requis').max(200, 'Titre trop long'),
  description: yup.string().required('Description requise'),
  incident_date: yup.string().required('Date de l\'incident requise'),
  severity: yup.string().required('Gravité requise'),
  action_taken: yup.string(),
  follow_up_required: yup.boolean(),
  follow_up_date: yup.string().nullable(),
});

type FormData = yup.InferType<typeof schema> & {
  student: string | number;
};

interface BehaviorReportFormProps {
  open: boolean;
  onClose: () => void;
  report?: BehaviorReport | null;
  selectedStudentId?: string;
}

const BehaviorReportForm: React.FC<BehaviorReportFormProps> = ({
  open,
  onClose,
  report,
  selectedStudentId,
}) => {
  const isEditing = Boolean(report);
  
  const [createReport, { isLoading: isCreating }] = useCreateBehaviorReportMutation();
  const [updateReport, { isLoading: isUpdating }] = useUpdateBehaviorReportMutation();
  
  const { data: studentsData } = useGetStudentsQuery({
    page: 1,
    page_size: 1000, // Get all students for dropdown
  });

  const reportTypes = [
    { value: 'positive', label: 'Comportement Positif' },
    { value: 'negative', label: 'Comportement Négatif' },
    { value: 'neutral', label: 'Observation Neutre' },
  ];

  const severityLevels = [
    { value: 'low', label: 'Faible' },
    { value: 'medium', label: 'Moyen' },
    { value: 'high', label: 'Élevé' },
  ];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      student: selectedStudentId || '',
      report_type: 'positive',
      title: '',
      description: '',
      incident_date: new Date().toISOString().split('T')[0],
      severity: 'low',
      action_taken: '',
      follow_up_required: false,
      follow_up_date: null,
    },
  });

  const watchFollowUpRequired = watch('follow_up_required');

  useEffect(() => {
    if (open && report) {
      reset({
        student: report.student,
        report_type: report.report_type,
        title: report.title,
        description: report.description,
        incident_date: report.incident_date,
        severity: report.severity,
        action_taken: report.action_taken,
        follow_up_required: report.follow_up_required,
        follow_up_date: report.follow_up_date,
      });
    } else if (open && selectedStudentId) {
      reset({
        student: selectedStudentId,
        report_type: 'positive',
        title: '',
        description: '',
        incident_date: new Date().toISOString().split('T')[0],
        severity: 'low',
        action_taken: '',
        follow_up_required: false,
        follow_up_date: null,
      });
    } else if (open) {
      reset({
        student: '',
        report_type: 'positive',
        title: '',
        description: '',
        incident_date: new Date().toISOString().split('T')[0],
        severity: 'low',
        action_taken: '',
        follow_up_required: false,
        follow_up_date: null,
      });
    }
  }, [open, report, selectedStudentId, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && report) {
        const updateData = {
          report_type: data.report_type as 'positive' | 'negative' | 'neutral',
          title: data.title,
          description: data.description,
          incident_date: data.incident_date,
          severity: data.severity as 'low' | 'medium' | 'high',
          action_taken: data.action_taken,
          follow_up_required: data.follow_up_required,
          follow_up_date: data.follow_up_required ? data.follow_up_date : null,
        };
        
        await updateReport({ id: report.id, data: updateData }).unwrap();
      } else {
        // Ensure student is not empty
        if (!data.student) {
          console.error('Le champ étudiant est requis');
          return;
        }
        
        const createData: CreateBehaviorReportRequest = {
          student: data.student,
          report_type: data.report_type as 'positive' | 'negative' | 'neutral',
          title: data.title,
          description: data.description,
          incident_date: data.incident_date,
          severity: data.severity as 'low' | 'medium' | 'high',
          action_taken: data.action_taken || '',
          follow_up_required: data.follow_up_required || false,
          follow_up_date: data.follow_up_required ? (data.follow_up_date || undefined) : undefined,
        };
        
        await createReport(createData).unwrap();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Échec de la sauvegarde du rapport de comportement:', error);
      
      // Handle validation errors
      if (error?.status === 400 && error?.data) {
        console.error('Erreurs de validation:', error.data);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditing ? 'Modifier le Rapport de Comportement' : 'Créer un Rapport de Comportement'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Controller
                name="student"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Étudiant"
                    select
                    fullWidth
                    error={!!errors.student}
                    helperText={errors.student?.message}
                    disabled={isEditing}
                  >
                    <MenuItem value="">Sélectionner un étudiant</MenuItem>
                    {studentsData?.results.map((student: Student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="report_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Type de Rapport"
                    select
                    fullWidth
                    error={!!errors.report_type}
                    helperText={errors.report_type?.message}
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Titre"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    placeholder="Titre bref pour le rapport de comportement"
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
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    placeholder="Description détaillée du comportement ou de l'incident..."
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="incident_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date de l'Incident"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.incident_date}
                    helperText={errors.incident_date?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="severity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Gravité"
                    select
                    fullWidth
                    error={!!errors.severity}
                    helperText={errors.severity?.message}
                  >
                    {severityLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="action_taken"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Action Entreprise (Optionnel)"
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Décrivez toute action entreprise en réponse à cet incident..."
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="follow_up_required"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    }
                    label="Suivi Requis"
                  />
                )}
              />
            </Grid>

            {watchFollowUpRequired && (
              <Grid item xs={12} md={6}>
                <Controller
                  name="follow_up_date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Date de Suivi"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={field.value || ''}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>

          {/* Severity Guide */}
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Guide de Gravité :
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2" color="info.main">
                <strong>Faible :</strong> Incidents mineurs, comportements positifs
              </Typography>
              <Typography variant="body2" color="warning.main">
                <strong>Moyen :</strong> Préoccupations modérées nécessitant une attention
              </Typography>
              <Typography variant="body2" color="error.main">
                <strong>Élevé :</strong> Incidents graves nécessitant une intervention immédiate
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isCreating || isUpdating}
            startIcon={(isCreating || isUpdating) && <CircularProgress size={20} />}
          >
            {isCreating || isUpdating 
              ? (isEditing ? 'Mise à jour...' : 'Création...') 
              : (isEditing ? 'Mettre à Jour le Rapport' : 'Créer le Rapport')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BehaviorReportForm;
