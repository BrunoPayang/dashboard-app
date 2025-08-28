import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  Avatar,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { Student } from '../../../types/student';

interface StudentProfileProps {
  student: Student;
  onEdit?: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onEdit }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const getGenderColor = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'primary';
      case 'female':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
            >
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                {student.first_name} {student.last_name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Student ID: {student.student_id}
              </Typography>
              <Chip
                label={student.is_active ? 'Active' : 'Inactive'}
                color={getStatusColor(student.is_active)}
                size="small"
              />
            </Box>
          </Box>
          {onEdit && (
            <IconButton
              color="primary"
              onClick={onEdit}
              size="large"
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <PersonIcon color="primary" />
                  Personal Information
                </Typography>
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {student.first_name} {student.last_name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Gender
                  </Typography>
                  <Chip
                    label={student.gender.charAt(0).toUpperCase() + student.gender.slice(1)}
                    color={getGenderColor(student.gender)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <SchoolIcon color="primary" />
                  Academic Information
                </Typography>
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Class Level
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {student.class_level}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Section
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {student.section}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <LocationIcon color="primary" />
                  School Information
                </Typography>
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    School Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {student.school_name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    School ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {student.school}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <CalendarIcon color="primary" />
                  Enrollment Information
                </Typography>
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Enrollment Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(student.enrollment_date)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Status
                  </Typography>
                  <Chip
                    label={student.is_active ? 'Active' : 'Inactive'}
                    color={getStatusColor(student.is_active)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {student.primary_parent && (
          <Box mt={3}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Parent Information
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Primary Parent ID: {student.primary_parent}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Note: Parent details would be fetched from a separate API endpoint
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default StudentProfile;

