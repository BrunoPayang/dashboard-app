import React from 'react';
import { Chip } from '@mui/material';
import type { PaymentStatus } from '../../../types/payment';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'small' | 'medium';
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ 
  status, 
  size = 'small' 
}) => {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'pending':
        return { color: 'warning' as const, label: 'Pending' };
      case 'paid':
        return { color: 'success' as const, label: 'Paid' };
      case 'overdue':
        return { color: 'error' as const, label: 'Overdue' };
      case 'cancelled':
        return { color: 'default' as const, label: 'Cancelled' };
      case 'refunded':
        return { color: 'secondary' as const, label: 'Refunded' };
      default:
        return { color: 'default' as const, label: status };
    }
  };

  const { color, label } = getStatusConfig(status);

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant="filled"
    />
  );
};

export default PaymentStatusBadge;



