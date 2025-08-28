import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './auth/authApi';
import { studentApi } from './students/studentApi';

import { paymentApi } from '../services/api/paymentApi';
import { academicApi } from '../services/api/academicApi';

import authReducer from './auth/authSlice';
import studentReducer from './students/studentSlice';
import paymentReducer from './payments/paymentSlice';
import academicReducer from './academics/academicSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    payments: paymentReducer,
    academics: academicReducer,
    [authApi.reducerPath]: authApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,

    [paymentApi.reducerPath]: paymentApi.reducer,
    [academicApi.reducerPath]: academicApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      studentApi.middleware,

      paymentApi.middleware,
      academicApi.middleware,

    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
