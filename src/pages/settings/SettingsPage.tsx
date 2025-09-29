import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  School as SchoolIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import {
  useGetSchoolQuery,
  useGetSchoolConfigurationQuery,
  usePatchSchoolMutation,
  usePatchSchoolConfigurationMutation,
} from '../../features/school/schoolApi';
import {
  SchoolInfoCard,
  SchoolEditForm,
  SchoolConfigurationCard,
  SchoolConfigurationEditForm,
} from '../../features/school/components';

const SettingsPage: React.FC = () => {
  const { schoolId, isSchoolStaff } = useCurrentSchool();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [isEditingConfiguration, setIsEditingConfiguration] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // API Queries
  const {
    data: school,
    isLoading: schoolLoading,
    error: schoolError,
  } = useGetSchoolQuery(schoolId!, {
    skip: !schoolId,
  });

  const {
    data: configuration,
    isLoading: configLoading,
    error: configError,
  } = useGetSchoolConfigurationQuery(schoolId!, {
    skip: !schoolId,
  });

  // Mutations
  const [patchSchool, { isLoading: schoolUpdating }] = usePatchSchoolMutation();
  const [patchConfiguration, { isLoading: configUpdating }] = usePatchSchoolConfigurationMutation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setIsEditingSchool(false);
    setIsEditingConfiguration(false);
  };

  const handleSchoolSave = async (data: any) => {
    if (!schoolId) return;

    try {
      console.log('Saving school data:', data);
      console.log('School ID:', schoolId);
      
      await patchSchool({ id: schoolId, data }).unwrap();
      setIsEditingSchool(false);
      setSnackbar({
        open: true,
        message: 'Informations de l\'école mises à jour avec succès',
        severity: 'success',
      });
    } catch (error: any) {
      console.error('School save error:', error);
      console.error('Error details:', error?.data);
      
      let errorMessage = 'Erreur lors de la mise à jour';
      
      if (error?.data?.detail) {
        errorMessage = error.data.detail;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data) {
        // Handle validation errors
        const validationErrors = Object.entries(error.data)
          .map(([field, messages]: [string, any]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(', ')}`;
            }
            return `${field}: ${messages}`;
          })
          .join('; ');
        
        if (validationErrors) {
          errorMessage = `Erreurs de validation: ${validationErrors}`;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleConfigurationSave = async (data: any) => {
    if (!schoolId) return;

    try {
      console.log('Saving configuration data:', data);
      console.log('School ID:', schoolId);
      
      // Clean up the data - remove any undefined values and ensure proper types
      const cleanData = Object.keys(data).reduce((acc: any, key) => {
        const value = data[key];
        if (value !== undefined && value !== null) {
          // Convert string numbers to actual numbers for numeric fields
          if (key === 'payment_reminder_days' || key === 'max_file_size_mb') {
            acc[key] = Number(value);
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {});
      
      console.log('Clean configuration data:', cleanData);
      
      await patchConfiguration({ id: schoolId, data: cleanData }).unwrap();
      setIsEditingConfiguration(false);
      setSnackbar({
        open: true,
        message: 'Configuration mise à jour avec succès',
        severity: 'success',
      });
    } catch (error: any) {
      console.error('Configuration save error:', error);
      console.error('Error details:', error?.data);
      
      let errorMessage = 'Erreur lors de la mise à jour';
      
      if (error?.data?.detail) {
        errorMessage = error.data.detail;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data) {
        // Handle validation errors
        const validationErrors = Object.entries(error.data)
          .map(([field, messages]: [string, any]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(', ')}`;
            }
            return `${field}: ${messages}`;
          })
          .join('; ');
        
        if (validationErrors) {
          errorMessage = `Erreurs de validation: ${validationErrors}`;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!isSchoolStaff) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Paramètres
        </Typography>
        <Alert severity="warning">
          Seuls les administrateurs et le personnel de l'école peuvent accéder aux paramètres.
        </Alert>
      </Box>
    );
  }

  if (schoolLoading || configLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (schoolError || configError) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Paramètres
        </Typography>
        <Alert severity="error">
          Erreur lors du chargement des données de l'école.
        </Alert>
      </Box>
    );
  }

  if (!schoolId) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Paramètres
        </Typography>
        <Alert severity="warning">
          Aucune école associée à votre compte. Veuillez contacter l'administrateur.
        </Alert>
      </Box>
    );
  }

  if (!school || !configuration) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Paramètres
        </Typography>
        <Alert severity="info">
          Chargement des données de l'école...
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Paramètres de l'École
      </Typography>

      <Paper sx={{ width: '100%', mt: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Settings tabs">
          <Tab
            icon={<SchoolIcon />}
            label="Informations de l'École"
            iconPosition="start"
          />
          <Tab
            icon={<SettingsIcon />}
            label="Configuration"
            iconPosition="start"
          />
        </Tabs>

        {/* School Information Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {isEditingSchool ? (
              <SchoolEditForm
                school={school}
                onSave={handleSchoolSave}
                onCancel={() => setIsEditingSchool(false)}
                isLoading={schoolUpdating}
              />
            ) : (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <EditIcon
                    sx={{ cursor: 'pointer', color: 'primary.main' }}
                    onClick={() => setIsEditingSchool(true)}
                  />
                </Box>
                <SchoolInfoCard school={school} />
              </Box>
            )}
          </Box>
        )}

        {/* Configuration Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {isEditingConfiguration ? (
              <SchoolConfigurationEditForm
                configuration={configuration}
                onSave={handleConfigurationSave}
                onCancel={() => setIsEditingConfiguration(false)}
                isLoading={configUpdating}
              />
            ) : (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <EditIcon
                    sx={{ cursor: 'pointer', color: 'primary.main' }}
                    onClick={() => setIsEditingConfiguration(true)}
                  />
                </Box>
                <SchoolConfigurationCard configuration={configuration} />
              </Box>
            )}
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default SettingsPage;
