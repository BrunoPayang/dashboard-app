import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const ReportsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Reports and analytics page - Coming soon!
        </Typography>
      </Paper>
    </Box>
  );
};

export default ReportsPage;
