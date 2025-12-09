import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteNote } from '@/hooks/notes-hooks';
import { useNavigate, useParams } from '@tanstack/react-router';

interface DeleteNoteDialogProps {
  noteId: string;
  children: React.ReactNode;
}

export function DeleteNoteDialog({ noteId, children }: DeleteNoteDialogProps) {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const currentNoteId = params.noteId as string | undefined;

  const { mutate: deleteNote } = useDeleteNote({
    onSuccess: (deletedNoteId) => {
      // If the deleted note is the one currently open, redirect to new note page
      if (currentNoteId === deletedNoteId) {
        navigate({ to: '/app/notes/new' });
      }
    },
  });

  const handleDelete = () => {
    deleteNote(noteId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            note.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
