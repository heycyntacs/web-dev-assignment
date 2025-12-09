import type { Note } from '@/types/notes';
import { Link, useParams } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { DeleteNoteDialog } from '../common/delete-note-dialog';
import { cn } from '@/lib/utils';

interface NoteItemProps {
  note: Note;
  onClick?: () => void;
}

export default function NoteItem({ note, onClick }: NoteItemProps) {
  const { noteId } = useParams({ strict: false });

  return (
    <div
      className={cn(
        'group hover:bg-secondary flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-4 py-2 text-sm',
        noteId === note.id ? 'bg-secondary' : 'bg-transparent'
      )}
    >
      <Link
        to="/app/notes/$noteId"
        params={{ noteId: note.id }}
        className="w-full truncate"
        onClick={onClick}
      >
        {note.title}
      </Link>
      <DeleteNoteDialog noteId={note.id}>
        <button className="hover:text-destructive cursor-pointer transition-opacity group-hover:opacity-100 md:opacity-0">
          <Trash2 className="size-4" />
        </button>
      </DeleteNoteDialog>
    </div>
  );
}
