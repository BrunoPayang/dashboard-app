import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';

const TokenStatusNotification: React.FC = () => {
  const { error } = useSelector((state: RootState) => state.auth);
  
  const isTokenError = error && error.includes('Token expired');

  return (
    <Snackbar
      open={isTokenError}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert severity="info" variant="filled">
        Actualisation de la session en cours...
      </Alert>
    </Snackbar>
  );
};

export default TokenStatusNotification;