import React from 'react';
import { Box, Container, Typography, Alert, CircularProgress } from '@mui/material';
import { useGetSchoolStatisticsQuery } from '../../features/school/schoolApi';
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import { SchoolStatistics } from '../../features/school/components';

const ReportsPage: React.FC = () => {
  const { school } = useCurrentSchool();
  
  const {
    data: statistics,
    isLoading,
    error
  } = useGetSchoolStatisticsQuery(school?.id || '', {
    skip: !school?.id
  });

  if (!school) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Aucune école sélectionnée. Veuillez sélectionner une école pour voir les statistiques.
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    const errorMessage = 'data' in error 
      ? (error.data as any)?.message || (error.data as any)?.detail || 'Erreur du serveur'
      : 'status' in error
      ? `Erreur ${error.status}`
      : 'Erreur inconnue';

    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Erreur lors du chargement des statistiques: {errorMessage}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Rapports et Analyses
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Statistiques détaillées pour {school.name}
        </Typography>
      </Box>

      {statistics && (
        <SchoolStatistics 
          statistics={statistics} 
          isLoading={isLoading}
          error={error}
        />
      )}
    </Container>
  );
};

export default ReportsPage;