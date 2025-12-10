import { useAppDispatch } from '@/app/app-dispatch';
import { logoutThunk } from '@/features/auth/auth-slice';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export default function LogoutButton({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClick = () => {
    dispatch(logoutThunk());
    navigate({ to: '/' });
  };

  return (
    <Button variant="outline" onClick={onClick} className={cn(className)}>
      Logout
    </Button>
  );
}
