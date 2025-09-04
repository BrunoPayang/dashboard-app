import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

const CommunicationAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState('7d');
  const [selectedChannel, setSelectedChannel] = useState('all');

  const analyticsData = {
    deliveryRate: 96.8,
    engagementRate: 64.3,
    responseTime: 1.8,
    totalNotifications: 1590,
    successfulDeliveries: 1540,
    failedDeliveries: 50,
    scheduledNotifications: 45,
    urgentNotifications: 12
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleExportData = (format: 'csv' | 'excel' | 'pdf') => {
    console.log(`Exportation des données au format ${format}`);
  };

  const getDeliveryRateColor = (rate: number) => {
    if (rate >= 95) return 'success';
    if (rate >= 80) return 'warning';
    return 'error';
  };

  const getEngagementRateColor = (rate: number) => {
    if (rate >= 70) return 'success';
    if (rate >= 50) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Analytics & Rapports
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Période</InputLabel>
            <Select
              value={dateRange}
              label="Période"
              onChange={(e) => setDateRange(e.target.value)}
            >
              <MenuItem value="7d">7 jours</MenuItem>
              <MenuItem value="30d">30 jours</MenuItem>
              <MenuItem value="90d">90 jours</MenuItem>
              <MenuItem value="1y">1 an</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Canal</InputLabel>
            <Select
              value={selectedChannel}
              label="Canal"
              onChange={(e) => setSelectedChannel(e.target.value)}
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
              <MenuItem value="notification">Notification</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => console.log('Actualisation des analytics')}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => handleExportData('csv')}
          >
            Exporter
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Analytics de communication :</strong> Suivez les performances de vos communications, 
        analysez l'engagement des parents et optimisez vos stratégies de notification.
      </Alert>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Taux de Livraison
                  </Typography>
                  <Typography variant="h4" color={getDeliveryRateColor(analyticsData.deliveryRate)}>
                    {analyticsData.deliveryRate}%
                  </Typography>
                </Box>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analyticsData.deliveryRate} 
                color={getDeliveryRateColor(analyticsData.deliveryRate) as any}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Taux d'Engagement
                  </Typography>
                  <Typography variant="h4" color={getEngagementRateColor(analyticsData.engagementRate)}>
                    {analyticsData.engagementRate}%
                  </Typography>
                </Box>
                <AccessTimeIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analyticsData.engagementRate} 
                color={getEngagementRateColor(analyticsData.engagementRate) as any}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Temps de Réponse Moyen
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {analyticsData.responseTime}h
                  </Typography>
                </Box>
                <AccessTimeIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                <TrendingDownIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                -12% vs semaine dernière
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total des Notifications
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {analyticsData.totalNotifications.toLocaleString()}
                  </Typography>
                </Box>
                <NotificationsIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                +8% vs semaine dernière
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Onglets d'analytics">
          <Tab label="Vue d'Ensemble" />
          <Tab label="Performance par Canal" />
          <Tab label="Tendances" />
          <Tab label="Rapports Détaillés" />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Statistiques Rapides
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                          <Typography variant="h4" color="success.dark">
                            {analyticsData.successfulDeliveries}
                          </Typography>
                          <Typography variant="body2" color="success.dark">
                            Livraisons Réussies
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                          <Typography variant="h4" color="error.dark">
                            {analyticsData.failedDeliveries}
                          </Typography>
                          <Typography variant="body2" color="error.dark">
                            Échecs
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                          <Typography variant="h4" color="warning.dark">
                            {analyticsData.scheduledNotifications}
                          </Typography>
                          <Typography variant="body2" color="warning.dark">
                            Programmées
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                          <Typography variant="h4" color="info.dark">
                            {analyticsData.urgentNotifications}
                          </Typography>
                          <Typography variant="body2" color="info.dark">
                            Urgentes
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Métriques d'Audience
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          Parents Actifs:
                        </Typography>
                        <Typography variant="h4" color="primary.main">
                          1,247
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          +5.2% vs période précédente
                        </Typography>
                      </Box>
                      <Divider />
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          Taux de Rétention:
                        </Typography>
                        <Typography variant="h4" color="success.main">
                          87.3%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          +2.1% vs période précédente
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Channel Performance Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance par Canal
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <EmailIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h6">Email</Typography>
                        <Typography variant="h4" color="primary.main">96.5%</Typography>
                        <Typography variant="body2" color="textSecondary">Taux de livraison</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <SmsIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h6">SMS</Typography>
                        <Typography variant="h4" color="success.main">98.1%</Typography>
                        <Typography variant="body2" color="textSecondary">Taux de livraison</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <NotificationsIcon color="warning" sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h6">Notification</Typography>
                        <Typography variant="h4" color="warning.main">94.2%</Typography>
                        <Typography variant="body2" color="textSecondary">Taux de livraison</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Trends Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Évolution des Métriques Clés
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Graphiques et tendances seront affichés ici
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip label="Taux de livraison en hausse" color="success" />
                  <Chip label="Engagement stable" color="info" />
                  <Chip label="Temps de réponse en baisse" color="success" />
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Detailed Reports Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Rapport de Performance
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Période analysée: {dateRange === '7d' ? '7 derniers jours' : 
                                        dateRange === '30d' ? '30 derniers jours' : 
                                        dateRange === '90d' ? '90 derniers jours' : '1 an'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          Recommandations d'Amélioration:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          • Optimiser les heures d'envoi pour améliorer l'engagement
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          • Personnaliser davantage le contenu des messages
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          • Réduire la fréquence des notifications non urgentes
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<DownloadIcon />}>
                      Télécharger PDF
                    </Button>
                    <Button size="small" startIcon={<DownloadIcon />}>
                      Télécharger Excel
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CommunicationAnalytics;
