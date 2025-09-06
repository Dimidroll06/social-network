import { type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from '../features/auth/auth.provider';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthProvider>
    </Provider>
  );
};
