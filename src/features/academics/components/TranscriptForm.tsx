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
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  useCreateTranscriptMutation,
  useUpdateTranscriptMutation 
} from '../../../services/api/academicApi';
import { useGetStudentsQuery } from '../../students/studentApi';
import type { Student } from '../../../types/student';

import type { 
  TranscriptRecord, 
  CreateTranscriptRequest
} from '../../../types/academic';

const schema = yup.object({
  student: yup.mixed<string | number>()
    .required('Étudiant requis')
    .test('not-empty', 'Veuillez sélectionner un étudiant', (value) => {
      return value !== '' && value !== null && value !== undefined;
    }),
  academic_year: yup.string().required('Année académique requise'),
  semester: yup.string().required('Semestre requis'),
  gpa: yup.number()
    .nullable()
    .min(0, 'La moyenne doit être d\'au moins 0.0')
    .max(4, 'La moyenne ne peut pas dépasser 4.0'),
  file_url: yup.string().url('Doit être une URL valide').nullable(),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema> & {
  student: string | number;
};

interface TranscriptFormProps {
  open: boolean;
  onClose: () => void;
  transcript?: TranscriptRecord | null;
  selectedStudentId?: string;
}

const TranscriptForm: React.FC<TranscriptFormProps> = ({
  open,
  onClose,
  transcript,
  selectedStudentId,
}) => {
  const isEditing = Boolean(transcript);
  
  const [createTranscript, { isLoading: isCreating }] = useCreateTranscriptMutation();
  const [updateTranscript, { isLoading: isUpdating }] = useUpdateTranscriptMutation();
  
  const { data: studentsData } = useGetStudentsQuery({
    page: 1,
    page_size: 1000, // Get all students for dropdown
  });

  const currentYear = new Date().getFullYear();
  const academicYears = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return `${year}-${year + 1}`;
  });

  const semesters = [
    { value: 'Fall', label: 'Fall Semester' },
    { value: 'Spring', label: 'Spring Semester' },
    { value: 'Summer', label: 'Summer Semester' },
    { value: '1st Semester', label: '1st Semester' },
    { value: '2nd Semester', label: '2nd Semester' },
    { value: '3rd Semester', label: '3rd Semester' },
  ];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      student: selectedStudentId || '',
      academic_year: `${currentYear}-${currentYear + 1}`,
      semester: 'Fall',
      gpa: null,
      file_url: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open && transcript) {
      reset({
        student: transcript.student,
        academic_year: transcript.academic_year,
        semester: transcript.semester,
        gpa: transcript.gpa,
        file_url: transcript.file_url || '',
        notes: transcript.notes,
      });
    } else if (open && selectedStudentId) {
      reset({
        student: selectedStudentId,
        academic_year: `${currentYear}-${currentYear + 1}`,
        semester: 'Fall',
        gpa: null,
        file_url: '',
        notes: '',
      });
    } else if (open) {
      reset({
        student: '',
        academic_year: `${currentYear}-${currentYear + 1}`,
        semester: 'Fall',
        gpa: null,
        file_url: '',
        notes: '',
      });
    }
  }, [open, transcript, selectedStudentId, reset, currentYear]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && transcript) {
        const updateData = {
          academic_year: data.academic_year,
          semester: data.semester,
          gpa: data.gpa ?? null,
          file_url: data.file_url || undefined,
          notes: data.notes,
        };
        
        await updateTranscript({ id: transcript.id, data: updateData }).unwrap();
      } else {
        // Ensure student is not empty
        if (!data.student) {
          console.error('Student field is required');
          return;
        }
        
        const createData: CreateTranscriptRequest = {
          student: data.student,
          academic_year: data.academic_year,
          semester: data.semester,
          gpa: data.gpa ?? null,
          file_url: data.file_url || undefined,
          notes: data.notes || '',
        };
        
        await createTranscript(createData).unwrap();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Failed to save transcript:', error);
      
      // Handle validation errors
      if (error?.status === 400 && error?.data) {
        console.error('Validation errors:', error.data);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
              <DialogTitle>
        {isEditing ? 'Modifier le Relevé de Notes' : 'Créer un Relevé de Notes'}
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
                    label="Student"
                    select
                    fullWidth
                    error={!!errors.student}
                    helperText={errors.student?.message}
                    disabled={isEditing}
                  >
                    <MenuItem value="">Select a student</MenuItem>
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
                name="academic_year"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Academic Year"
                    select
                    fullWidth
                    error={!!errors.academic_year}
                    helperText={errors.academic_year?.message}
                  >
                    {academicYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="semester"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Semester"
                    select
                    fullWidth
                    error={!!errors.semester}
                    helperText={errors.semester?.message}
                  >
                    {semesters.map((semester) => (
                      <MenuItem key={semester.value} value={semester.value}>
                        {semester.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="gpa"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="GPA (Optional)"
                    type="number"
                    fullWidth
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? null : parseFloat(value));
                    }}
                    inputProps={{
                      min: 0,
                      max: 4,
                      step: 0.1,
                    }}
                    placeholder="Enter GPA (0.0 - 4.0)"
                    error={!!errors.gpa}
                    helperText={errors.gpa?.message || 'Scale: 0.0 - 4.0 (Leave empty if not available)'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="file_url"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="File URL (Optional)"
                    fullWidth
                    placeholder="https://example.com/transcript.pdf"
                    error={!!errors.file_url}
                    helperText={errors.file_url?.message || 'Link to transcript file'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notes (Optional)"
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Additional information about this transcript..."
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* GPA Guide */}
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              GPA Scale Guide:
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Typography variant="body2" color="success.main">
                3.5-4.0: Excellent
              </Typography>
              <Typography variant="body2" color="warning.main">
                2.5-3.4: Good
              </Typography>
              <Typography variant="body2" color="error.main">
                0.0-2.4: Fair
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isCreating || isUpdating}
            startIcon={(isCreating || isUpdating) && <CircularProgress size={20} />}
          >
            {isCreating || isUpdating 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Transcript' : 'Create Transcript')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TranscriptForm;
