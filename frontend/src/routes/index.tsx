import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Notely</h1>
        <h2 className="text-muted-foreground text-lg">
          Your personal note-taking app
        </h2>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
