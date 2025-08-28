import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { clearPaymentSelection } from '../paymentSlice';
import { PAYMENT_METHODS } from '../../../types/payment';
import { useBulkPaymentActions } from '../hooks/useBulkPaymentActions';
import type { PaymentMethod } from '../../../types/payment';

interface BulkPaymentActionsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const BulkPaymentActions: React.FC<BulkPaymentActionsProps> = ({
  onSuccess,
  onError,
}) => {
  const dispatch = useAppDispatch();
  const selectedPayments = useAppSelector((state) => state.payments.selectedPayments);
  
  const [markAsPaidDialogOpen, setMarkAsPaidDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  
  const { markMultipleAsPaid, isLoading } = useBulkPaymentActions();

  const handleMarkAsPaidClick = () => {
    setMarkAsPaidDialogOpen(true);
  };

  const handleMarkAsPaidConfirm = async () => {
    try {
      const result = await markMultipleAsPaid(selectedPayments, {
        payment_method: paymentMethod,
        reference_number: referenceNumber || undefined,
        receipt_url: receiptUrl || undefined,
      });

      setMarkAsPaidDialogOpen(false);
      dispatch(clearPaymentSelection());
      
      // Reset form
      setPaymentMethod('cash');
      setReferenceNumber('');
      setReceiptUrl('');

      if (result.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorMessage = `Updated ${result.successCount} payments, ${result.errorCount} failed`;
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      console.error('Failed to mark payments as paid:', error);
      if (onError) {
        onError('Failed to update payment records');
      }
    }
  };

  const handleDialogClose = () => {
    setMarkAsPaidDialogOpen(false);
    setPaymentMethod('cash');
    setReferenceNumber('');
    setReceiptUrl('');
  };

  if (selectedPayments.length === 0) {
    return null;
  }

  return (
    <>
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          startIcon={<PaymentIcon />}
          onClick={handleMarkAsPaidClick}
          disabled={selectedPayments.length === 0}
        >
          Mark as Paid ({selectedPayments.length})
        </Button>
      </Box>

      {/* Mark as Paid Dialog */}
      <Dialog
        open={markAsPaidDialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Mark {selectedPayments.length} Payment{selectedPayments.length > 1 ? 's' : ''} as Paid
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This will mark all selected payment records as paid with today's date.
          </Typography>

          <TextField
            label="Payment Method"
            select
            fullWidth
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            sx={{ mb: 2 }}
          >
            {PAYMENT_METHODS.map((method) => (
              <MenuItem key={method.value} value={method.value}>
                {method.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Reference Number (Optional)"
            fullWidth
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="e.g., TXN123456789"
            sx={{ mb: 2 }}
          />

          <TextField
            label="Receipt URL (Optional)"
            fullWidth
            value={receiptUrl}
            onChange={(e) => setReceiptUrl(e.target.value)}
            placeholder="https://example.com/receipt.pdf"
            helperText="Link to receipt or payment confirmation"
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button
            onClick={handleMarkAsPaidConfirm}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <PaymentIcon />}
          >
            {isLoading ? 'Processing...' : 'Mark as Paid'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BulkPaymentActions;
