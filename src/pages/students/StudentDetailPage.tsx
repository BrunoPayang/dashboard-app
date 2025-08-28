import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useGetStudentQuery } from '../../features/students/studentApi';
import StudentProfile from '../../features/students/components/StudentProfile';

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: student, isLoading, error } = useGetStudentQuery(id!);

  const handleEdit = () => {
    navigate(`/students/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/students');
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Students
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEdit}
        >
          Edit Student
        </Button>
      </Box>

      <StudentProfile student={student} onEdit={handleEdit} />
    </Box>
  );
};

export default StudentDetailPage;
