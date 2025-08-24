import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import {
  People,
  School,
  Book,
  Notifications,
} from '@mui/icons-material';

const DashboardPage: React.FC = () => {
  // Mock data - will be replaced with real API calls
  const stats = [
    { title: 'Total Students', value: '1,234', icon: <People />, color: 'primary.main' },
    { title: 'Active Parents', value: '987', icon: <School />, color: 'success.main' },
    { title: 'Academic Records', value: '5,678', icon: <Book />, color: 'info.main' },
    { title: 'Notifications', value: '23', icon: <Notifications />, color: 'warning.main' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      color: stat.color,
                      fontSize: 40,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2">Add Student</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Notifications sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="body2">Send Notification</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                • New student enrolled: John Doe
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                • Transcript uploaded for Student ID: 12345
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                • Payment received: $500 from Parent ID: 67890
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                • Behavior report created for Student ID: 11111
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
