import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './auth/authApi';
import { studentsApi } from './students/studentsApi';
import { parentsApi } from './parents/parentsApi';
import { academicsApi } from './academics/academicsApi';
import { notificationsApi } from './notifications/notificationsApi';
import { filesApi } from './files/filesApi';
import { schoolApi } from './school/schoolApi';
import authReducer from './auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [parentsApi.reducerPath]: parentsApi.reducer,
    [academicsApi.reducerPath]: academicsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [filesApi.reducerPath]: filesApi.reducer,
    [schoolApi.reducerPath]: schoolApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      studentsApi.middleware,
      parentsApi.middleware,
      academicsApi.middleware,
      notificationsApi.middleware,
      filesApi.middleware,
      schoolApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
