import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const StudentsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Students Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Students management page - Coming soon!
        </Typography>
      </Paper>
    </Box>
  );
};

export default StudentsPage;
