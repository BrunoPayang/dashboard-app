import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Chip,
  Switch,
  Divider,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Payment as PaymentIcon,
  CloudUpload as UploadIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { SchoolConfigurationResponse } from '../../../types/school';

interface SchoolConfigurationCardProps {
  configuration: SchoolConfigurationResponse;
  onEdit?: () => void;
}

const SchoolConfigurationCard: React.FC<SchoolConfigurationCardProps> = ({
  configuration,
  onEdit: _onEdit,
}) => {
  const getSemesterLabel = (semester: string) => {
    const semesters = {
      first: 'Premier Semestre',
      second: 'Deuxième Semestre',
      third: 'Troisième Semestre',
    };
    return semesters[semester as keyof typeof semesters] || semester;
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon color="primary" />
            <Typography variant="h6">Configuration de l'École</Typography>
          </Box>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Academic Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon color="primary" />
              Paramètres Académiques
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Début d'Année Académique
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {new Date(configuration.academic_year_start).toLocaleDateString('fr-FR')}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Fin d'Année Académique
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {new Date(configuration.academic_year_end).toLocaleDateString('fr-FR')}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Semestre Actuel
            </Typography>
            <Chip
              label={getSemesterLabel(configuration.current_semester)}
              color="primary"
              size="small"
            />
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <NotificationsIcon color="primary" />
              Paramètres de Notification
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">
                Notifications SMS
              </Typography>
              <Switch
                checked={configuration.enable_sms_notifications}
                disabled
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">
                Notifications Email
              </Typography>
              <Switch
                checked={configuration.enable_email_notifications}
                disabled
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">
                Notifications Push
              </Typography>
              <Switch
                checked={configuration.enable_push_notifications}
                disabled
                size="small"
              />
            </Box>
          </Grid>

          {/* Payment Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <PaymentIcon color="primary" />
              Paramètres de Paiement
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Devise
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {configuration.currency}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Rappel de Paiement (jours)
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {configuration.payment_reminder_days} jours
            </Typography>
          </Grid>

          {/* File Upload Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <UploadIcon color="primary" />
              Paramètres de Téléchargement
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Taille Maximum des Fichiers
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {configuration.max_file_size_mb} MB
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Types de Fichiers Autorisés
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {configuration.allowed_file_types.map((type, index) => (
                <Chip
                  key={index}
                  label={type}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SchoolConfigurationCard;
