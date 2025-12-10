import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth-slice';
import sidebarReducer from '../features/sidebar/sidebar-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
  },
});

// Infer the RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
