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

  const dashboardCards = [
    {
      title: 'Students',
      description: 'Manage student records, enrollments, and information',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: 'View Students',
      path: '/students',
      color: '#e3f2fd',
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
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      action: 'Manage School',
      path: '/school',
      color: '#f3e5f5',
    },
    {
      title: 'Reports & Analytics',
      description: 'Generate reports and view student performance analytics',
      icon: <AssessmentIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      action: 'View Reports',
      path: '/reports',
      color: '#e3f2fd',
    },
    {
      title: 'System Settings',
      description: 'Configure dashboard preferences and system options',
      icon: <SettingsIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      action: 'Settings',
      path: '/settings',
      color: '#fff8e1',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Beautiful School Header */}
      <DashboardHeader />
      
      {/* Welcome Message */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: 'background.default' }}>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
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
        <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
          Quick Overview
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" component="div" color="primary.main" fontWeight="bold">
                {studentsLoading ? (
                  <CircularProgress size={24} color="primary" />
                ) : (
                  studentsData?.count || 0
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" component="div" color="success.main" fontWeight="bold">
                {paymentSummaryLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  formatCurrency(paymentSummary?.paid_amount || 0)
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" component="div" color="warning.main" fontWeight="bold">
                {paymentSummaryLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  formatCurrency(paymentSummary?.pending_amount || 0)
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Payments
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" component="div" color="error.main" fontWeight="bold">
                {overdueLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  overduePayments?.length || 0
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overdue Payments
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;
