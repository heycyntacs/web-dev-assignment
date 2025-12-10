import { useGetNotes } from '@/hooks/notes-hooks';
import { Skeleton } from '../ui/skeleton';
import NoteItem from './note-item';

interface NotesListProps {
  onItemClick?: () => void;
}

export default function NotesList({ onItemClick }: NotesListProps) {
  const { data: notes, isLoading, error } = useGetNotes();

  return (
    <div className="flex w-full flex-col gap-1">
      {isLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full bg-gray-300" />
        ))}
      {error && <p className="text-destructive">Error loading notes</p>}
      {notes &&
        notes.map((note) => (
          <NoteItem key={note.id} note={note} onClick={onItemClick} />
        ))}
    </div>
  );
}
