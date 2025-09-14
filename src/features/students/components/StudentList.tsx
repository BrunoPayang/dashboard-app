import React, { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  TablePagination,
  Skeleton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useGetStudentsQuery } from '../studentApi';
import { useGetClassesForDropdownQuery } from '../../classes/classApi';
import { Student, StudentFilters } from '../../../types/student';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../features/store';
import { setFilters, setPagination } from '../studentSlice';

interface StudentListProps {
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  filters: StudentFilters;
}

const StudentList: React.FC<StudentListProps> = ({
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  filters,
}) => {
  const dispatch = useDispatch();
  const { currentPage, pageSize, totalCount } = useSelector(
    (state: RootState) => state.students.pagination
  );
  const { school } = useSelector((state: RootState) => state.auth);
  
  // Call hooks BEFORE any conditional returns

  const { data, isLoading, error } = useGetStudentsQuery({
    ...filters,
    schoolId: school?.id || ''
  });

  // Fetch classes for displaying class names
  const { data: classes = [] } = useGetClassesForDropdownQuery({
    school: school?.id,
    is_active: true
  });
  
  // Helper function to get class information
  const getClassInfo = (classAssignedId?: string) => {
    if (!classAssignedId) return { name: 'Non assigné', section: '-' };
    const classInfo = classes.find(cls => cls.id === classAssignedId);
    return classInfo ? { name: classInfo.name, section: classInfo.section } : { name: 'Classe inconnue', section: '-' };
  };

  // Debug logging
  console.log('StudentList - filters:', filters);
  console.log('StudentList - school:', school);
  console.log('StudentList - query result:', { data, isLoading, error });
  
  // Log the actual API URL being called
  const apiUrl = `${process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api'}/students/`;
  console.log('StudentList - API URL being called:', apiUrl);
  console.log('StudentList - Query params:', { ...filters, schoolId: school?.id || '' });
  console.log('StudentList - Access token:', localStorage.getItem('access_token'));
  console.log('StudentList - School data from Redux:', school);
  
  // Temporary test: Make the same request that worked in browser
  useEffect(() => {
    const testDirectAPI = async () => {
      try {
        // Test with the exact same parameters that worked in browser
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api'}/students/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Direct API test - Status:', response.status);
        console.log('Direct API test - Headers:', response.headers);
        console.log('Direct API test - URL:', response.url);
        
        if (!response.ok) {
          console.error('Direct API test failed:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error response:', errorText);
          return;
        }
        
        const data = await response.json();
        console.log('Direct API test result:', data);
      } catch (error) {
        console.error('Direct API test error:', error);
      }
    };
    
    // Test with different approaches
    const testDifferentApproaches = async () => {
      console.log('Testing different API approaches...');
      
      // Test 1: Without Content-Type header
      try {
        const response1 = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api'}/students/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const text1 = await response1.text();
        console.log('Test 1 (no Content-Type) - Status:', response1.status, 'Response:', text1.substring(0, 100));
      } catch (error) {
        console.error('Test 1 failed:', error);
      }
      
      // Test 2: With different User-Agent
      try {
        const response2 = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api'}/students/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        const text2 = await response2.text();
        console.log('Test 2 (with User-Agent) - Status:', response2.status, 'Response:', text2.substring(0, 200));
      } catch (error) {
        console.error('Test 2 failed:', error);
      }
      
      // Test 3: Check if it's a CORS issue
      try {
        const response3 = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api'}/students/`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const text3 = await response3.text();
        console.log('Test 3 (CORS mode) - Status:', response3.status, 'Response:', text3.substring(0, 200));
      } catch (error) {
        console.error('Test 3 failed:', error);
      }
    };
    
    if (school?.id) {
      console.log('Testing direct API with school ID:', school.id);
      testDirectAPI();
      testDifferentApproaches();
    }
  }, [school?.id]);

  useEffect(() => {
    if (data) {
      dispatch(
        setPagination({
          currentPage: filters.page || 1,
          pageSize: filters.page_size || 10,
          totalCount: data.count,
        })
      );
    }
  }, [data, dispatch, filters.page, filters.page_size]);
  
  // If no school data, don't render the list
  if (!school) {
    return null;
  }

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setFilters({ page: newPage + 1 }));
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    dispatch(setFilters({ page_size: newPageSize, page: 1 }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  if (error) {
    // Extract meaningful error message from RTK Query error
    let errorMessage = 'Échec du chargement des étudiants. Veuillez réessayer.';
    
    if (error && typeof error === 'object') {
      if ('status' in error) {
        // RTK Query error with status
        if (error.status === 'FETCH_ERROR') {
          errorMessage = 'Erreur réseau. Veuillez vérifier votre connexion.';
        } else if (error.status === 'PARSING_ERROR') {
          errorMessage = 'Erreur d\'analyse des données. Veuillez contacter le support.';
        } else if (error.status === 'TIMEOUT_ERROR') {
          errorMessage = 'Délai d\'attente dépassé. Veuillez réessayer.';
        } else if (error.status === 'CUSTOM_ERROR') {
          errorMessage = error.error || errorMessage;
        }
      }
      
      // Check for API error details
      if ('data' in error && error.data) {
        if (typeof error.data === 'string') {
          // Check if this is ngrok HTML content
          if (error.data.includes('<!DOCTYPE html>') && error.data.includes('ngrok')) {
            errorMessage = 'ngrok bloque la requête. Veuillez d\'abord visiter l\'URL ngrok pour l\'autoriser.';
          } else {
            errorMessage = error.data;
          }
        } else if (typeof error.data === 'object' && error.data !== null) {
          const errorData = error.data as Record<string, any>;
          if ('detail' in errorData && typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if ('message' in errorData && typeof errorData.message === 'string') {
            errorMessage = errorData.message;
          } else if ('error' in errorData && typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          }
        }
      }
    }
    
    console.error('Student list error:', error);
    
    return (
      <Box p={2}>
        <Typography color="error" variant="body1">
          Erreur lors du chargement des étudiants : {errorMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Étudiant</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Classe</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>École</TableCell>
              <TableCell>Date d'Inscription</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from(new Array(pageSize)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                  </TableRow>
                ))
              : data?.results.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>{student.student_id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {student.first_name} {student.last_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {student.class_assigned ? getClassInfo(student.class_assigned).name : student.class_level || 'Non assigné'}
                        </Typography>
                        {student.class_assigned && (
                          <Typography variant="caption" color="textSecondary">
                            {getClassInfo(student.class_assigned).name} - {getClassInfo(student.class_assigned).section}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.class_assigned ? getClassInfo(student.class_assigned).section : student.section || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.gender === 'male' ? 'Masculin' : student.gender === 'female' ? 'Féminin' : 'Autre'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{student.school_name}</TableCell>
                    <TableCell>{formatDate(student.enrollment_date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.is_active ? 'Actif' : 'Inactif'}
                        color={getStatusColor(student.is_active)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => onViewStudent(student)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onEditStudent(student)}
                        color="secondary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDeleteStudent(student)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {data && (
        <TablePagination
          component="div"
          count={totalCount}
          page={currentPage - 1}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Lignes par page :"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      )}
    </Paper>
  );
};

export default StudentList;