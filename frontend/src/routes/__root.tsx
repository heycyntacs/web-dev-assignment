import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import GlobalErrorBoundary from '@/components/common/error-boundary';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

const queryClient = new QueryClient();

const RootLayout = () => (
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Outlet />
      </Provider>
      <TanStackRouterDevtools />
    </QueryClientProvider>
  </GlobalErrorBoundary>
);

export const Route = createRootRoute({ component: RootLayout });
