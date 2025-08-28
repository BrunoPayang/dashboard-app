import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { setPaymentFilters, clearPaymentFilters } from '../paymentSlice';
import { PAYMENT_TYPES, PAYMENT_STATUSES } from '../../../types/payment';
import type { PaymentType, PaymentStatus } from '../../../types/payment';

const paymentTypeOptions = [
  { value: '' as PaymentType | '', label: 'All Types' },
  ...PAYMENT_TYPES,
];

const paymentStatusOptions = [
  { value: '' as PaymentStatus | '', label: 'All Status' },
  ...PAYMENT_STATUSES,
];

const PaymentFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.payments.filters);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    dispatch(setPaymentFilters({ [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearPaymentFilters());
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filter Payments</Typography>
        {hasActiveFilters && (
          <IconButton onClick={handleClearFilters} size="small">
            <Clear />
          </IconButton>
        )}
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Search"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            fullWidth
            placeholder="Search by student name or reference..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            label="Payment Type"
            value={filters.payment_type}
            onChange={(e) => handleFilterChange('payment_type', e.target.value)}
            select
            fullWidth
          >
            {paymentTypeOptions.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            label="Status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            select
            fullWidth
          >
            {paymentStatusOptions.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PaymentFilters;



