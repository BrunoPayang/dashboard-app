import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PaymentFilters } from '../../types/payment';

interface PaymentState {
  selectedPayments: number[];
  filters: PaymentFilters;
  bulkOperationLoading: boolean;
}

const initialState: PaymentState = {
  selectedPayments: [],
  filters: {
    payment_type: '',
    status: '',
    search: '',
  },
  bulkOperationLoading: false,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPaymentFilters: (
      state,
      action: PayloadAction<Partial<PaymentFilters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearPaymentFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    togglePaymentSelection: (state, action: PayloadAction<number>) => {
      const paymentId = action.payload;
      const index = state.selectedPayments.indexOf(paymentId);
      
      if (index > -1) {
        state.selectedPayments.splice(index, 1);
      } else {
        state.selectedPayments.push(paymentId);
      }
    },
    
    selectAllPayments: (state, action: PayloadAction<number[]>) => {
      state.selectedPayments = action.payload;
    },
    
    clearPaymentSelection: (state) => {
      state.selectedPayments = [];
    },
    
    setBulkOperationLoading: (state, action: PayloadAction<boolean>) => {
      state.bulkOperationLoading = action.payload;
    },
  },
});

export const {
  setPaymentFilters,
  clearPaymentFilters,
  togglePaymentSelection,
  selectAllPayments,
  clearPaymentSelection,
  setBulkOperationLoading,
} = paymentSlice.actions;

export default paymentSlice.reducer;



