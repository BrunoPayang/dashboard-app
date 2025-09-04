import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { useGetStudentsQuery } from '../../features/students/studentApi';
import { useGetPaymentSummaryQuery, useGetOverduePaymentsQuery } from '../../services/api/paymentApi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { formatCurrency } from '../../utils/formatters';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { school } = useSelector((state: RootState) => state.auth);
  
  // Fetch students to get the count
  const { data: studentsData, isLoading: studentsLoading } = useGetStudentsQuery(
    {
      page: 1,
      page_size: 1, // We only need the count, so minimal page size
      schoolId: school?.id || '',
    },
    {
      skip: !school?.id, // Skip the query if no school ID
    }
  );

  // Fetch payment data
  const { data: paymentSummary, isLoading: paymentSummaryLoading } = useGetPaymentSummaryQuery();
  const { data: overduePayments, isLoading: overdueLoading } = useGetOverduePaymentsQuery();

  // Generate school-themed colors
  const getSchoolColors = () => {
    const primaryColor = school?.primary_color || '#1976d2';
    const secondaryColor = school?.secondary_color || '#dc004e';
    
    // Create light variants of school colors
    const lightenColor = (color: string, amount: number = 0.1) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      const newR = Math.min(255, Math.floor(r + (255 - r) * amount));
      const newG = Math.min(255, Math.floor(g + (255 - g) * amount));
      const newB = Math.min(255, Math.floor(b + (255 - b) * amount));
      
      return `rgb(${newR}, ${newG}, ${newB})`;
    };
    
    return {
      primary: primaryColor,
      secondary: secondaryColor,
      primaryLight: lightenColor(primaryColor, 0.9),
      secondaryLight: lightenColor(secondaryColor, 0.9),
    };
  };

  const schoolColors = getSchoolColors();

  const dashboardCards = [
    {
      title: 'Students',
      description: 'Manage student records, enrollments, and information',
      icon: <PeopleIcon sx={{ fontSize: 40, color: schoolColors.primary }} />,
      action: 'View Students',
      path: '/students',
      color: schoolColors.primaryLight,
    },
    {
      title: 'Payment Management',
      description: 'Track student payments, fees, and financial records',
      icon: <PaymentIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      action: 'Manage Payments',
      path: '/payments',
      color: '#e8f5e8',
    },
    {
      title: 'School Management',
      description: 'Configure school settings, classes, and academic structure',
      icon: <SchoolIcon sx={{ fontSize: 40, color: schoolColors.secondary }} />,
      action: 'Manage School',
      path: '/settings',
      color: schoolColors.secondaryLight,
    },
    {
      title: 'Reports & Analytics',
      description: 'Generate reports and view student performance analytics',
      icon: <AssessmentIcon sx={{ fontSize: 40, color: schoolColors.primary }} />,
      action: 'View Reports',
      path: '/reports',
      color: schoolColors.primaryLight,
    },
    {
      title: 'System Settings',
      description: 'Configure dashboard preferences and system options',
      icon: <SettingsIcon sx={{ fontSize: 40, color: schoolColors.secondary }} />,
      action: 'Settings',
      path: '/settings',
      color: schoolColors.secondaryLight,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Beautiful School Header */}
      <DashboardHeader />
      
      {/* Welcome Message */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: `linear-gradient(135deg, ${schoolColors.primaryLight} 0%, ${schoolColors.secondaryLight} 100%)`,
          border: `1px solid ${schoolColors.primary}20`,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom color={schoolColors.primary} fontWeight="bold">
          Bienvenue sur votre Tableau de Bord Scolaire
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez les opérations de votre école, les dossiers d'étudiants et les tâches administratives depuis un emplacement central.
        </Typography>
      </Paper>

      {/* Dashboard Cards */}
      <Grid container spacing={3}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: card.color,
                  }}
                >
                  {card.icon}
                </Box>
                
                <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                  {card.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={() => navigate(card.path)}
                  sx={{ 
                    minWidth: 120,
                    textTransform: 'none',
                    fontWeight: 'medium',
                  }}
                >
                  {card.action}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Stats Section */}
      <Box sx={{ mt: 4 }}>
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom 
          sx={{ 
            mb: 2,
            color: schoolColors.primary,
            fontWeight: 'bold',
          }}
        >
          Aperçu Rapide
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                border: `2px solid ${schoolColors.primary}20`,
                '&:hover': {
                  border: `2px solid ${schoolColors.primary}40`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Typography variant="h4" component="div" color={schoolColors.primary} fontWeight="bold">
                {studentsLoading ? (
                  <CircularProgress size={24} sx={{ color: schoolColors.primary }} />
                ) : (
                  studentsData?.count || 0
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Étudiants
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                border: `2px solid ${schoolColors.secondary}20`,
                '&:hover': {
                  border: `2px solid ${schoolColors.secondary}40`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Typography variant="h4" component="div" color={schoolColors.secondary} fontWeight="bold">
                {paymentSummaryLoading ? (
                  <CircularProgress size={24} sx={{ color: schoolColors.secondary }} />
                ) : (
                  formatCurrency(paymentSummary?.paid_amount || 0)
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revenus Totaux
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                border: `2px solid ${schoolColors.primary}20`,
                '&:hover': {
                  border: `2px solid ${schoolColors.primary}40`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Typography variant="h4" component="div" color={schoolColors.primary} fontWeight="bold">
                {paymentSummaryLoading ? (
                  <CircularProgress size={24} sx={{ color: schoolColors.primary }} />
                ) : (
                  formatCurrency(paymentSummary?.pending_amount || 0)
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Paiements en Attente
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                border: `2px solid ${schoolColors.secondary}20`,
                '&:hover': {
                  border: `2px solid ${schoolColors.secondary}40`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Typography variant="h4" component="div" color={schoolColors.secondary} fontWeight="bold">
                {overdueLoading ? (
                  <CircularProgress size={24} sx={{ color: schoolColors.secondary }} />
                ) : (
                  overduePayments?.length || 0
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Paiements en Retard
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;
