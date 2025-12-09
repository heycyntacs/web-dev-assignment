import LoginForm from '@/components/forms/login-form';
import { redirectIfAuthenticated } from '@/lib/auth-middleware';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  beforeLoad: redirectIfAuthenticated,
});

function RouteComponent() {
  return <LoginForm />;
}
