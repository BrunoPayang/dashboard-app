import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../features/store';
import { clearFilters } from '../../features/students/studentSlice';

import StudentSearch from '../../features/students/components/StudentSearch';
import StudentList from '../../features/students/components/StudentList';
import StudentForm from '../../features/students/components/StudentForm';
import { useCreateStudentMutation } from '../../features/students/studentApi';
import { Student, StudentFormData } from '../../types/student';

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.students.filters);
  const { school } = useSelector((state: RootState) => state.auth);
  
  // Call ALL hooks BEFORE any conditional returns
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
  
  // If no school data, show error
  if (!school) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">
          School information not available. Please contact your administrator.
        </Typography>
      </Box>
    );
  }

  const handleCreateStudent = async (data: StudentFormData) => {
    try {
      await createStudent(data).unwrap();
      setSnackbar({
        open: true,
        message: 'Student created successfully!',
        severity: 'success',
      });
      setIsCreateDialogOpen(false);
      dispatch(clearFilters());
    } catch (error: any) {
      // Extract the actual error message from the API response
      let errorMessage = 'Failed to create student. Please try again.';
      
      if (error?.data?.detail) {
        // If the API returns a detail message
        errorMessage = error.data.detail;
      } else if (error?.data?.message) {
        // If the API returns a message field
        errorMessage = error.data.message;
      } else if (error?.data) {
        // If the API returns other error data, try to format it
        if (typeof error.data === 'string') {
          errorMessage = error.data;
        } else if (typeof error.data === 'object') {
          // Try to extract meaningful error information
          const errorKeys = Object.keys(error.data);
          if (errorKeys.length > 0) {
            const firstError = error.data[errorKeys[0]];
            if (Array.isArray(firstError)) {
              errorMessage = firstError[0] || errorMessage;
            } else if (typeof firstError === 'string') {
              errorMessage = firstError;
            }
          }
        }
      } else if (error?.message) {
        // Fallback to error.message
        errorMessage = error.message;
      }
      
      // Log the full error for debugging
      console.error('Student creation error:', error);
      console.error('Error data:', error?.data);
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleViewStudent = (student: Student) => {
    navigate(`/students/${student.id}`);
  };

  const handleEditStudent = (student: Student) => {
    navigate(`/students/${student.id}/edit`);
  };

  const handleDeleteStudent = (student: Student) => {
    // This would typically open a confirmation dialog
    // For now, we'll just show a message
          setSnackbar({
        open: true,
        message: `Delete functionality for ${student.first_name} ${student.last_name} would be implemented here`,
        severity: 'success',
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Students
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Add Student
        </Button>
      </Box>

      <StudentSearch />
      
      <StudentList
        filters={filters}
        onViewStudent={handleViewStudent}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
      />

      {/* Create Student Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <StudentForm
            onSubmit={handleCreateStudent}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

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

export default StudentsPage;
