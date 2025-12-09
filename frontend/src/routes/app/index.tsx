import { useAppDispatch } from '@/app/app-dispatch';
import { Button } from '@/components/ui/button';
import { logoutThunk } from '@/features/auth/auth-slice';
import { requireAuth } from '@/lib/auth-middleware';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/app/')({
  component: AppLayout,
  beforeLoad: requireAuth,
});

function AppLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClick = () => {
    dispatch(logoutThunk());
    navigate({ to: '/' });
  };

  return (
    <>
      <Button onClick={onClick}>Logout</Button>
    </>
  );
}
