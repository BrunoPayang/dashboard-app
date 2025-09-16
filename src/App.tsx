import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { RootState } from './features/store';
import { checkAuthStatus } from './features/auth/authSlice';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import StudentsPage from './pages/students/StudentsPage';
import StudentDetailPage from './pages/students/StudentDetailPage';
import StudentEditPage from './pages/students/StudentEditPage';
import StudentCreatePage from './pages/students/StudentCreatePage';
import ClassesPage from './pages/classes/ClassesPage';

import PaymentsPage from './pages/payments/PaymentsPage';
import AcademicsPage from './pages/academics/AcademicsPage';
import ParentsPage from './pages/parents/ParentsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import FilesPage from './pages/files/FilesPage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
import GlobalLoadingOverlay from './components/common/GlobalLoadingOverlay';

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  // Check for existing token on app load
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
    <GlobalLoadingOverlay />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="students/create" element={<StudentCreatePage />} />
        <Route path="students/:id" element={<StudentDetailPage />} />
        <Route path="students/:id/edit" element={<StudentEditPage />} />
        <Route path="classes" element={<ClassesPage />} />

        <Route path="payments" element={<PaymentsPage />} />
        <Route path="academics" element={<AcademicsPage />} />
        <Route path="parents" element={<ParentsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="files" element={<FilesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </>
  );
}

export default App;
