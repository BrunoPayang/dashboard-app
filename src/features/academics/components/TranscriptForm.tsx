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
import { useGetFilesQuery } from '../../files/services/fileApi';
import { useAuth } from '../../../hooks/useAuth';
import type { Student } from '../../../types/student';
import type { FileItem } from '../../files/types/file';

import type { 
  TranscriptRecord, 
  CreateTranscriptRequest
} from '../../../types/academic';

// Utility function to build complete URL from path
const buildCompleteUrl = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path; // Already a complete URL
  }
  
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api';
  const domain = baseUrl.replace('/api', ''); // Remove /api for media URLs
  return `${domain}${path}`;
};

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
    .min(0, 'La moyenne doit être d\'au moins 0')
    .max(20, 'La moyenne ne peut pas dépasser 20'),
  file_name: yup.string().required('Nom du fichier requis'),
  file_url: yup.string()
    .required('Fichier requis')
    .test('not-empty', 'Veuillez sélectionner un fichier', (value) => {
      return value !== '' && value !== null && value !== undefined;
    })
    .test('valid-file-url', 'URL du fichier invalide', (value) => {
      if (!value) return false;
      console.log('Validating file URL:', value);
      
      // Accept complete URLs or paths that can be converted to URLs
      const completeUrl = buildCompleteUrl(value);
      console.log('Complete URL:', completeUrl);
      
      try {
        new URL(completeUrl);
        console.log('URL validation: PASSED');
        return true;
      } catch (error) {
        console.log('URL validation: FAILED', error);
        return false;
      }
    }),
  uploaded_by: yup.number().required('Utilisateur requis'),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema> & {
  student: string | number;
  file_name: string;
  file_url: string;
  uploaded_by: number;
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
  
  const { data: filesData } = useGetFilesQuery({ page: 1, page_size: 1000 });
  const { user } = useAuth();

  // Debug: Log files data to see what URLs are available
  useEffect(() => {
    if (filesData?.results) {
      console.log('Available files for transcript:', filesData.results.length);
      filesData.results.forEach((file: FileItem, index: number) => {
        const completeUrl = buildCompleteUrl(file.firebase_url);
        console.log(`File ${index + 1}:`, {
          id: file.id,
          name: file.original_name,
          firebase_url: file.firebase_url,
          complete_url: completeUrl,
          url_type: typeof file.firebase_url,
          is_complete: completeUrl.startsWith('http')
        });
      });
    }
  }, [filesData]);

  const currentYear = new Date().getFullYear();
  const academicYears = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return `${year}-${year + 1}`;
  });

  const semesters = [
    { value: 'first', label: 'Premier Semestre' },
    { value: 'second', label: 'Deuxième Semestre' },
    { value: 'annual', label: 'Rapport Annuel' },
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
      semester: 'first',
      gpa: null,
      file_name: 'Bulletin',
      file_url: '',
      uploaded_by: user?.id || 0,
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
        file_name: 'Bulletin',
        file_url: transcript.file_url || '',
        uploaded_by: user?.id || 0,
        notes: transcript.notes,
      });
    } else if (open && selectedStudentId) {
      reset({
        student: selectedStudentId,
        academic_year: `${currentYear}-${currentYear + 1}`,
        semester: 'first',
        gpa: null,
        file_name: 'Bulletin',
        file_url: '',
        uploaded_by: user?.id || 0,
        notes: '',
      });
    } else if (open) {
      reset({
        student: '',
        academic_year: `${currentYear}-${currentYear + 1}`,
        semester: 'first',
        gpa: null,
        file_name: 'Bulletin',
        file_url: '',
        uploaded_by: user?.id || 0,
        notes: '',
      });
    }
  }, [open, transcript, selectedStudentId, reset, currentYear, user?.id]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Form submission data:', data);
      console.log('File URL validation check:', {
        file_url: data.file_url,
        length: data.file_url?.length,
        starts_with_http: data.file_url?.startsWith('http'),
        contains_firebase: data.file_url?.includes('firebase'),
        contains_media: data.file_url?.includes('media')
      });

      // Enhanced validation before submission
      if (!data.file_url) {
        console.error('File URL is missing');
        return;
      }

      const isValidUrl = data.file_url.startsWith('http://') || 
                        data.file_url.startsWith('https://') || 
                        data.file_url.startsWith('/') ||
                        data.file_url.startsWith('./') ||
                        data.file_url.includes('firebase') ||
                        data.file_url.includes('media/uploads');

      if (!isValidUrl) {
        console.error('Invalid file URL format:', data.file_url);
        return;
      }

      if (isEditing && transcript) {
        // Build complete URL for update as well
        const completeFileUrl = data.file_url ? buildCompleteUrl(data.file_url) : undefined;
        
        const updateData = {
          academic_year: data.academic_year,
          semester: data.semester,
          gpa: data.gpa ?? null,
          file_url: completeFileUrl,
          notes: data.notes,
        };
        
        console.log('Updating transcript with data:', updateData);
        console.log('Original file URL:', data.file_url);
        console.log('Complete file URL:', completeFileUrl);
        await updateTranscript({ id: transcript.id, data: updateData }).unwrap();
      } else {
        // Ensure file_url is valid and complete
        if (!data.file_url) {
          console.error('File URL is required');
          return;
        }

        // Build complete URL if it's just a path
        const completeFileUrl = buildCompleteUrl(data.file_url);
        
        const createData: CreateTranscriptRequest = {
          student: data.student,
          academic_year: data.academic_year,
          semester: data.semester,
          gpa: data.gpa ?? null,
          file_name: data.file_name,
          file_url: completeFileUrl,
          uploaded_by: data.uploaded_by,
          notes: data.notes || '',
        };
        
        console.log('Creating transcript with data:', createData);
        console.log('Original file URL:', data.file_url);
        console.log('Complete file URL:', completeFileUrl);
        console.log('File URL is valid URL:', completeFileUrl.startsWith('http'));
        
        await createTranscript(createData).unwrap();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Failed to save transcript:', error);
      
      // Handle validation errors
      if (error?.status === 400 && error?.data) {
        console.error('Validation errors:', error.data);
        console.error('Full error response:', JSON.stringify(error.data, null, 2));
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
                    label="Moyenne (Optionnel)"
                    type="number"
                    fullWidth
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? null : parseFloat(value));
                    }}
                    inputProps={{
                      min: 0,
                      max: 20,
                      step: 0.1,
                    }}
                    placeholder="Saisir la moyenne (0 - 20)"
                    error={!!errors.gpa}
                    helperText={errors.gpa?.message || 'Échelle: 0 - 20 (Laisser vide si non disponible)'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="file_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="File Name"
                    fullWidth
                    value="Bulletin"
                    disabled
                    error={!!errors.file_name}
                    helperText={errors.file_name?.message || 'Automatically set to "Bulletin"'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="file_url"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Select File"
                    select
                    fullWidth
                    error={!!errors.file_url}
                    helperText={errors.file_url?.message || 'Sélectionnez un fichier parmi les fichiers téléchargés. Le fichier doit avoir une URL valide.'}
                  >
                    <MenuItem value="">Select a file</MenuItem>
                    {filesData?.results.map((file: FileItem) => (
                      <MenuItem key={file.id} value={file.firebase_url}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {file.original_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {file.file_type} • {file.file_size_mb ? file.file_size_mb.toFixed(1) : 'Unknown'} MB • {file.uploaded_at ? new Date(file.uploaded_at).toLocaleDateString() : 'Unknown date'}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Hidden field for uploaded_by */}
            <Controller
              name="uploaded_by"
              control={control}
              render={({ field }) => (
                <input type="hidden" {...field} />
              )}
            />

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
