import React, { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Warning, Visibility } from '@mui/icons-material';
import { useGetOverduePaymentsQuery } from '../../../services/api/paymentApi';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import PaymentTypeIcon from './PaymentTypeIcon';

interface OverduePaymentAlertProps {
  onViewPayment?: (paymentId: number) => void;
}

const OverduePaymentAlert: React.FC<OverduePaymentAlertProps> = ({
  onViewPayment,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: overduePayments, isLoading } = useGetOverduePaymentsQuery();

  if (isLoading || !overduePayments || overduePayments.length === 0) {
    return null;
  }

  const totalOverdueAmount = overduePayments.reduce(
    (sum, payment) => sum + parseFloat(payment.amount),
    0
  );

  return (
    <>
      <Alert 
        severity="warning" 
        icon={<Warning />}
        action={
          <Button 
            color="inherit" 
            size="small"
            onClick={() => setDialogOpen(true)}
            startIcon={<Visibility />}
          >
            View Details
          </Button>
        }
        sx={{ mb: 3 }}
      >
        <Typography variant="body2" fontWeight="medium">
          {overduePayments.length} payment{overduePayments.length > 1 ? 's' : ''} overdue
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total overdue amount: {formatCurrency(totalOverdueAmount)}
        </Typography>
      </Alert>

      {/* Overdue Payments Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Warning color="warning" />
            Overdue Payments ({overduePayments.length})
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            These payment records are past their due dates and require immediate attention.
          </Typography>

          <List>
            {overduePayments.map((payment) => (
              <ListItem
                key={payment.id}
                divider
                sx={{
                  border: 1,
                  borderColor: 'error.light',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.04)',
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mr={2}>
                  <PaymentTypeIcon type={payment.payment_type} size="medium" />
                </Box>
                
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1" fontWeight="medium">
                        {payment.student_name}
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        {formatCurrency(parseFloat(payment.amount), payment.currency)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {payment.payment_type.replace('_', ' ').toUpperCase()} • 
                        Due: {formatDate(payment.due_date)}
                      </Typography>
                      <Box mt={1} display="flex" gap={1}>
                        <Chip
                          label={`${payment.days_overdue} days overdue`}
                          color="error"
                          size="small"
                        />
                        {payment.reference_number && (
                          <Chip
                            label={`Ref: ${payment.reference_number}`}
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </Box>
                    </Box>
                  }
                />
                
                {onViewPayment && (
                  <Button
                    size="small"
                    onClick={() => {
                      onViewPayment(payment.id);
                      setDialogOpen(false);
                    }}
                  >
                    View
                  </Button>
                )}
              </ListItem>
            ))}
          </List>

          <Box 
            sx={{ 
              mt: 2, 
              p: 2, 
              backgroundColor: 'error.light',
              borderRadius: 1,
              textAlign: 'center'
            }}
          >
            <Typography variant="body1" fontWeight="medium" color="error.dark">
              Total Overdue Amount: {formatCurrency(totalOverdueAmount)}
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OverduePaymentAlert;
