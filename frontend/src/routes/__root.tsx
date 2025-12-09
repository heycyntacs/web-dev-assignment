import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import GlobalErrorBoundary from '@/components/common/error-boundary';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

const RootLayout = () => (
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Outlet />
        <Toaster />
      </Provider>
    </QueryClientProvider>
  </GlobalErrorBoundary>
);

export const Route = createRootRoute({ component: RootLayout });
