import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const AcademicsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Academic Records
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Academic records management page - Coming soon!
        </Typography>
      </Paper>
    </Box>
  );
};

export default AcademicsPage;
