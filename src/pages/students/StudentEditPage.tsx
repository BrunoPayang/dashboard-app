import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Snackbar,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useGetStudentQuery, useUpdateStudentMutation } from '../../features/students/studentApi';
import StudentForm from '../../features/students/components/StudentForm';
import { StudentFormData } from '../../types/student';

const StudentEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: student, isLoading, error } = useGetStudentQuery(id!);
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleUpdate = async (data: StudentFormData) => {
    try {
      await updateStudent({ id: id!, data }).unwrap();
      setSnackbar({
        open: true,
        message: 'Student updated successfully!',
        severity: 'success',
      });
      // Navigate back to student detail page after a short delay
      setTimeout(() => {
        navigate(`/students/${id}`);
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update student. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCancel = () => {
    navigate(`/students/${id}`);
  };

  const handleBack = () => {
    navigate('/students');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !student) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Students
        </Button>
        <Alert severity="error">
          {error ? `Error loading student: ${error.toString()}` : 'Student not found'}
        </Alert>
      </Box>
    );
  }

  // Convert student data to form data format
  const initialFormData: Partial<StudentFormData> = {
    first_name: student.first_name,
    last_name: student.last_name,
    school: student.school,
    class_level: student.class_level,
    section: student.section,
    gender: student.gender,
    enrollment_date: student.enrollment_date,
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Students
        </Button>
        <Typography variant="h4" component="h1">
          Edit Student
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <StudentForm
          initialData={initialFormData}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
          isLoading={isUpdating}
          isEdit={true}
        />
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentEditPage;
