import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  TrendingUp as TrendingUpIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Person2 as Person2Icon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { SchoolStatistics } from '../../../types/school';

interface SchoolStatisticsProps {
  statistics: SchoolStatistics;
  isLoading?: boolean;
  error?: any;
}

const SchoolStatisticsComponent: React.FC<SchoolStatisticsProps> = ({
  statistics,
  isLoading = false,
  error
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Erreur lors du chargement des statistiques: {error.message || 'Erreur inconnue'}
      </Alert>
    );
  }

  if (!statistics) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        Aucune donnée de statistiques disponible
      </Alert>
    );
  }

  const { 
    total_students, 
    class_distribution, 
    class_details, 
    class_statistics, 
    gender_distribution, 
    recent_enrollments, 
    payment_statistics 
  } = statistics;

  // Calculate percentages
  const maleCount = gender_distribution.find(g => g.gender === 'male')?.count || 0;
  const femaleCount = gender_distribution.find(g => g.gender === 'female')?.count || 0;
  const malePercentage = total_students > 0 ? (maleCount / total_students) * 100 : 0;
  const femalePercentage = total_students > 0 ? (femaleCount / total_students) * 100 : 0;

  const paidPercentage = payment_statistics.total_payments > 0 
    ? (payment_statistics.paid_payments / payment_statistics.total_payments) * 100 
    : 0;

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SchoolIcon color="primary" />
        Statistiques de l'École
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Étudiants</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {total_students}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {recent_enrollments} nouvelles inscriptions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ClassIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Classes Actives</Typography>
              </Box>
              <Typography variant="h3" color="secondary">
                {class_statistics.active_classes}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                sur {class_statistics.total_classes} total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Taux d'Occupation</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {class_statistics.utilization_rate}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {total_students}/{class_statistics.total_capacity} places
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PaymentIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Paiements</Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {payment_statistics.paid_payments}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                sur {payment_statistics.total_payments} total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Gender Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                Répartition par Genre
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: 'blue' }} />
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography variant="body2">Masculin</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={malePercentage} 
                      sx={{ mt: 0.5, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="h6">{maleCount} ({malePercentage.toFixed(1)}%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person2Icon sx={{ mr: 1, color: 'pink' }} />
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography variant="body2">Féminin</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={femalePercentage} 
                      sx={{ mt: 0.5, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="h6">{femaleCount} ({femalePercentage.toFixed(1)}%)</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentIcon color="primary" />
                Statistiques de Paiement
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Paiements Effectués</Typography>
                  <Typography variant="body2">{payment_statistics.paid_payments}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={paidPercentage} 
                  color="success"
                  sx={{ mb: 2, height: 8, borderRadius: 4 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Paiements en Attente</Typography>
                  <Typography variant="body2">
                    {payment_statistics.total_payments - payment_statistics.paid_payments}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={100 - paidPercentage} 
                  color="warning"
                  sx={{ mb: 2, height: 8, borderRadius: 4 }}
                />

                {payment_statistics.overdue_payments > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <WarningIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="error">
                      {payment_statistics.overdue_payments} paiements en retard
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Class Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ClassIcon color="primary" />
                Répartition par Niveau
              </Typography>
              <List dense>
                {class_distribution.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        {item.count}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.class_assigned__level || 'Non assigné'}
                      secondary={`${item.count} étudiant${item.count > 1 ? 's' : ''}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Class Details Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon color="primary" />
                Détails des Classes
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Classe</TableCell>
                      <TableCell align="center">Étudiants</TableCell>
                      <TableCell align="center">Capacité</TableCell>
                      <TableCell align="center">Statut</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {class_details.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {classItem.full_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {classItem.academic_year}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {classItem.student_count}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {classItem.max_students}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={classItem.is_active ? 'Active' : 'Inactive'}
                            color={classItem.is_active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SchoolStatisticsComponent;
