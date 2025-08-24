import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const FilesPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        File Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          File management page - Coming soon!
        </Typography>
      </Paper>
    </Box>
  );
};

export default FilesPage;
