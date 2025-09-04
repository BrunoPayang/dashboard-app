import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './auth/authApi';
import { studentApi } from './students/studentApi';
import { notificationsApi } from './notifications/notificationsApi';
import { fileApi } from './files/services/fileApi';
import { schoolApi } from './school/schoolApi';

import { paymentApi } from '../services/api/paymentApi';
import { academicApi } from '../services/api/academicApi';
import { parentManagementApi } from '../services/api/parentManagementApi';

import authReducer from './auth/authSlice';
import studentReducer from './students/studentSlice';
import paymentReducer from './payments/paymentSlice';
import academicReducer from './academics/academicSlice';
import parentManagementReducer from './parentManagement/parentManagementSlice';
import fileReducer from './files/fileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    payments: paymentReducer,
    academics: academicReducer,
    parentManagement: parentManagementReducer,
    files: fileReducer,
    [authApi.reducerPath]: authApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [fileApi.reducerPath]: fileApi.reducer,
    [schoolApi.reducerPath]: schoolApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [academicApi.reducerPath]: academicApi.reducer,
    [parentManagementApi.reducerPath]: parentManagementApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      studentApi.middleware,
      notificationsApi.middleware,
      fileApi.middleware,
      schoolApi.middleware,
      paymentApi.middleware,
      academicApi.middleware,
      parentManagementApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
