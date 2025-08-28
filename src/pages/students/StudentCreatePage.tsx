import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useCreateStudentMutation } from '../../features/students/studentApi';
import StudentForm from '../../features/students/components/StudentForm';
import { StudentFormData } from '../../types/student';

const StudentCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCreateStudent = async (data: StudentFormData) => {
    try {
      const newStudent = await createStudent(data).unwrap();
      setSnackbar({
        open: true,
        message: 'Student created successfully!',
        severity: 'success',
      });
      // Navigate to the new student's detail page after a short delay
      setTimeout(() => {
        navigate(`/students/${newStudent.id}`);
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to create student. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
        >
          Back to Students
        </Button>
        <Typography variant="h4" component="h1">
          Add New Student
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <StudentForm
          onSubmit={handleCreateStudent}
          onCancel={handleCancel}
          isLoading={isCreating}
          isEdit={false}
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

export default StudentCreatePage;

