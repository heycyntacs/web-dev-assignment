import { Link } from '@tanstack/react-router';
import { Plus, X } from 'lucide-react';
import LogoutButton from '../common/logout-button';
import NotesList from './notes-list';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/app/app-dispatch';
import { closeSidebar } from '@/features/sidebar/sidebar-slice';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);

  const handleClose = () => {
    dispatch(closeSidebar());
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <nav
        className={cn(
          'fixed top-0 left-0 z-50 flex h-screen w-64 flex-col justify-between bg-gray-200 p-4 transition-transform duration-300 md:sticky md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col items-start justify-start gap-10">
          <div className="flex w-full items-center justify-between">
            <div className="w-full text-center">
              <Link
                to="/app"
                className="text-xl font-bold"
                onClick={handleClose}
              >
                Notely
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="md:hidden"
              aria-label="Close sidebar"
            >
              <X className="size-5" />
            </Button>
          </div>
          <Button asChild className="w-full">
            <Link to="/app/notes/new">
              <Plus className="size-5" />
              New Note
            </Link>
          </Button>
          <NotesList onItemClick={handleClose} />
        </div>
        <LogoutButton className="w-full" />
      </nav>
    </>
  );
}
