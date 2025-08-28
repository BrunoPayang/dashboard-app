import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper,
  Toolbar,
  Chip,
} from '@mui/material';
import {
  Add,
} from '@mui/icons-material';
import PaymentSummaryCards from '../../features/payments/components/PaymentSummaryCards';
import PaymentFilters from '../../features/payments/components/PaymentFilters';
import PaymentList from '../../features/payments/components/PaymentList';
import PaymentForm from '../../features/payments/components/PaymentForm';
import BulkPaymentActions from '../../features/payments/components/BulkPaymentActions';
import OverduePaymentAlert from '../../features/payments/components/OverduePaymentAlert';
import { 
  useUpdatePaymentRecordMutation,
  useDeletePaymentRecordMutation 
} from '../../services/api/paymentApi';
import { useAppSelector } from '../../hooks/redux';
import type { PaymentRecord } from '../../types/payment';

const PaymentsPage: React.FC = () => {
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const selectedPayments = useAppSelector((state) => state.payments.selectedPayments);
  
  const [updatePayment] = useUpdatePaymentRecordMutation();
  const [deletePayment] = useDeletePaymentRecordMutation();

  const handleCreatePayment = () => {
    setSelectedPayment(null);
    setPaymentFormOpen(true);
  };

  const handleEditPayment = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setPaymentFormOpen(true);
  };

  const handleMarkAsPaid = async (paymentId: number) => {
    try {
      await updatePayment({
        id: paymentId,
        data: {
          status: 'paid',
          paid_date: new Date().toISOString().split('T')[0],
        },
      }).unwrap();
      
      showSnackbar('Payment marked as paid successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to update payment status', 'error');
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      try {
        await deletePayment(paymentId).unwrap();
        showSnackbar('Payment record deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to delete payment record', 'error');
      }
    }
  };

  const handleBulkSuccess = () => {
    showSnackbar(`${selectedPayments.length} payments marked as paid successfully`, 'success');
  };

  const handleBulkError = (error: string) => {
    showSnackbar(error, 'error');
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestion des Paiements
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérer les frais d'étudiants, suivre les paiements et consulter les rapports financiers
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreatePayment}
        >
                      Créer un Paiement
        </Button>
      </Box>

      {/* Overdue Payments Alert */}
      <OverduePaymentAlert onViewPayment={(id) => console.log('View payment:', id)} />

      {/* Payment Summary Cards */}
      <Box mb={3}>
        <PaymentSummaryCards />
      </Box>

      {/* Payment Filters */}
      <PaymentFilters />

      {/* Bulk Actions Toolbar */}
      {selectedPayments.length > 0 && (
        <Paper sx={{ mb: 2 }}>
          <Toolbar>
            <Chip
              label={`${selectedPayments.length} selected`}
              color="primary"
              sx={{ mr: 2 }}
            />
            <BulkPaymentActions 
              onSuccess={handleBulkSuccess}
              onError={handleBulkError}
            />
          </Toolbar>
        </Paper>
      )}

      {/* Payment List */}
      <PaymentList
        onEditPayment={handleEditPayment}
        onDeletePayment={handleDeletePayment}
        onMarkAsPaid={handleMarkAsPaid}
      />

      {/* Payment Form Dialog */}
      <PaymentForm
        open={paymentFormOpen}
        onClose={() => setPaymentFormOpen(false)}
        payment={selectedPayment}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentsPage;
