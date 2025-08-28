import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Schedule,
  AttachMoney,
} from '@mui/icons-material';
import { useGetPaymentSummaryQuery } from '../../../services/api/paymentApi';
import { formatCurrency } from '../../../utils/formatters';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error';
  subtitle?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
}) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" color={color}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box color={`${color}.main`}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const PaymentSummaryCards: React.FC = () => {
  const { data: summary, isLoading, error } = useGetPaymentSummaryQuery();

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load payment summary. Please try again.
      </Alert>
    );
  }

  if (!summary) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(summary.paid_amount)}
          icon={<TrendingUp />}
          color="success"
          subtitle={`${summary.total_payments} total payments`}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Pending Payments"
          value={formatCurrency(summary.pending_amount)}
          icon={<Schedule />}
          color="warning"
          subtitle="Awaiting payment"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Overdue Payments"
          value={formatCurrency(summary.overdue_amount)}
          icon={<TrendingDown />}
          color="error"
          subtitle="Requires attention"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Total Amount"
          value={formatCurrency(summary.total_amount)}
          icon={<AttachMoney />}
          color="primary"
          subtitle="All payment records"
        />
      </Grid>
    </Grid>
  );
};

export default PaymentSummaryCards;



