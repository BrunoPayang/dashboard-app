import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const NotificationsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Notifications management page - Coming soon!
        </Typography>
      </Paper>
    </Box>
  );
};

export default NotificationsPage;
