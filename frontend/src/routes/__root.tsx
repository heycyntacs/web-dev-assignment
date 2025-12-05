import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import GlobalErrorBoundary from '@/components/common/error-boundary';

const queryClient = new QueryClient();

const RootLayout = () => (
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <TanStackRouterDevtools />
    </QueryClientProvider>
  </GlobalErrorBoundary>
);

export const Route = createRootRoute({ component: RootLayout });
