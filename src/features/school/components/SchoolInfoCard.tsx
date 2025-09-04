import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Avatar,
  Grid,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CheckCircle as VerifiedIcon,
  Cancel as UnverifiedIcon,
} from '@mui/icons-material';
import { School } from '../../../types/school';

interface SchoolInfoCardProps {
  school: School;
  onEdit?: () => void;
}

const SchoolInfoCard: React.FC<SchoolInfoCardProps> = ({ school, onEdit: _onEdit }) => {
  const getSchoolTypeLabel = (type: string) => {
    const types = {
      primary: 'Primaire',
      secondary: 'Secondaire',
      both: 'Primaire & Secondaire',
      university: 'Université',
      other: 'Autre',
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={school.logo}
              sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}
            >
              <SchoolIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" component="h2">
                {school.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip
                  label={getSchoolTypeLabel(school.school_type)}
                  color="primary"
                  size="small"
                />
                {school.is_verified ? (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Vérifié"
                    color="success"
                    size="small"
                  />
                ) : (
                  <Chip
                    icon={<UnverifiedIcon />}
                    label="Non vérifié"
                    color="warning"
                    size="small"
                  />
                )}
                <Chip
                  label={school.is_active ? 'Actif' : 'Inactif'}
                  color={school.is_active ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </Box>
          </Box>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="primary" />
              Contact
            </Typography>
            <Box sx={{ pl: 3, mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Email: {school.contact_email}
              </Typography>
              {school.contact_phone && (
                <Typography variant="body2" color="textSecondary">
                  Téléphone: {school.contact_phone}
                </Typography>
              )}
              {school.website && (
                <Typography variant="body2" color="textSecondary">
                  Site web: {school.website}
                </Typography>
              )}
            </Box>

            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon color="primary" />
              Adresse
            </Typography>
            <Box sx={{ pl: 3 }}>
              <Typography variant="body2" color="textSecondary">
                {school.address || 'Non spécifiée'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {school.city}, {school.state} {school.postal_code}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {school.country}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informations Académiques
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Année académique: {school.academic_year || 'Non spécifiée'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Étudiants: {school.student_count || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Personnel: {school.staff_count || 0}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Couleurs de l'École
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {school.primary_color && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: school.primary_color,
                      borderRadius: '50%',
                      border: '1px solid #ccc',
                    }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    Primaire
                  </Typography>
                </Box>
              )}
              {school.secondary_color && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: school.secondary_color,
                      borderRadius: '50%',
                      border: '1px solid #ccc',
                    }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    Secondaire
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SchoolInfoCard;
