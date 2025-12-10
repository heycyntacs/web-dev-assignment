import LoginForm from '@/components/forms/login-form';
import { redirectIfAuthenticated } from '@/lib/auth-middleware';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  beforeLoad: redirectIfAuthenticated,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Link to="/" className="text-4xl font-bold">
          Notely
        </Link>
        <p className="text-muted-foreground text-lg">
          Login to your account to continue
        </p>
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
      <p className="text-muted-foreground text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary">
          Sign up
        </Link>
      </p>
    </div>
  );
}
