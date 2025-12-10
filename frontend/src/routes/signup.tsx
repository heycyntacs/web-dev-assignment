import SignupForm from '@/components/forms/signup-form';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Link to="/" className="text-4xl font-bold">
          Notely
        </Link>
        <p className="text-muted-foreground text-lg">
          Create an account to continue
        </p>
      </div>
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
