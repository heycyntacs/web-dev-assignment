import SignupForm from '@/components/forms/signup-form';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-bold">Sign Up</h1>
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
