import Sidebar from '@/components/sidebar';
import { requireAuth } from '@/lib/auth-middleware';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAppDispatch } from '@/app/app-dispatch';
import { openSidebar } from '@/features/sidebar/sidebar-slice';

export const Route = createFileRoute('/app')({
  component: AppLayout,
  beforeLoad: requireAuth,
});

function AppLayout() {
  const dispatch = useAppDispatch();

  return (
    <div className="relative flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="mb-4 md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch(openSidebar())}
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </Button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
