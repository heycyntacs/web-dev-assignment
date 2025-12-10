import { requireAuth } from '@/lib/auth-middleware';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/')({
  component: AppLayout,
  beforeLoad: requireAuth,
});

function AppLayout() {
  return <div></div>;
}
