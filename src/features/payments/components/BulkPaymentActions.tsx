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
        const errorMessage = `${result.successCount} paiements mis à jour, ${result.errorCount} échecs`;
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      console.error('Échec du marquage des paiements comme payés:', error);
      if (onError) {
        onError('Échec de la mise à jour des enregistrements de paiement');
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
          Marquer comme Payé ({selectedPayments.length})
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
          Marquer {selectedPayments.length} Paiement{selectedPayments.length > 1 ? 's' : ''} comme Payé
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Cela marquera tous les enregistrements de paiement sélectionnés comme payés avec la date d'aujourd'hui.
          </Typography>

          <TextField
            label="Méthode de Paiement"
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
            label="Numéro de Référence (Optionnel)"
            fullWidth
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="ex: TXN123456789"
            sx={{ mb: 2 }}
          />

          <TextField
            label="URL du Reçu (Optionnel)"
            fullWidth
            value={receiptUrl}
            onChange={(e) => setReceiptUrl(e.target.value)}
            placeholder="https://example.com/receipt.pdf"
            helperText="Lien vers le reçu ou la confirmation de paiement"
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleDialogClose}>
            Annuler
          </Button>
          <Button
            onClick={handleMarkAsPaidConfirm}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <PaymentIcon />}
          >
            {isLoading ? 'Traitement...' : 'Marquer comme Payé'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BulkPaymentActions;
