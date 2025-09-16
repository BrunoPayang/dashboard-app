import React from 'react';
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';
import { useIsFetching, useIsMutating } from '@reduxjs/toolkit/query/react';

const GlobalLoadingOverlay: React.FC = () => {
  const numFetching = useIsFetching();
  const numMutating = useIsMutating();
  const isOpen = (numFetching as number) + (numMutating as number) > 0;

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
      open={isOpen}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <CircularProgress color="inherit" />
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Loading...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default GlobalLoadingOverlay;


