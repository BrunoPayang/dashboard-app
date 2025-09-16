import React from 'react';
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { authApi } from '../../features/auth/authApi';
import { studentApi } from '../../features/students/studentApi';
import { notificationsApi } from '../../features/notifications/notificationsApi';
import { fileApi } from '../../features/files/services/fileApi';
import { schoolApi } from '../../features/school/schoolApi';
import { classApi } from '../../features/classes/classApi';
import { paymentApi } from '../../services/api/paymentApi';
import { academicApi } from '../../services/api/academicApi';
import { parentManagementApi } from '../../services/api/parentManagementApi';

function isApiBusy(state: RootState, reducerPath: string): boolean {
  const apiState: any = (state as any)[reducerPath];
  if (!apiState) return false;

  const hasPendingQueries = Object.values(apiState.queries || {}).some(
    (q: any) => q && (q.status === 'pending' || q.status === 'loading')
  );

  const hasPendingMutations = Object.values(apiState.mutations || {}).some(
    (m: any) => m && (m.status === 'pending' || m.status === 'loading')
  );

  return hasPendingQueries || hasPendingMutations;
}

const GlobalLoadingOverlay: React.FC = () => {
  const isOpen = useSelector((state: RootState) => {
    return (
      isApiBusy(state, authApi.reducerPath) ||
      isApiBusy(state, studentApi.reducerPath) ||
      isApiBusy(state, notificationsApi.reducerPath) ||
      isApiBusy(state, fileApi.reducerPath) ||
      isApiBusy(state, schoolApi.reducerPath) ||
      isApiBusy(state, classApi.reducerPath) ||
      isApiBusy(state, paymentApi.reducerPath) ||
      isApiBusy(state, academicApi.reducerPath) ||
      isApiBusy(state, parentManagementApi.reducerPath)
    );
  });

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


