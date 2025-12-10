import { Skeleton } from '@/components/ui/skeleton';
import { useGetNote, useUpdateNote } from '@/hooks/notes-hooks';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { EditableTitle } from '@/components/notes/editable-title';
import { EditableContent } from '@/components/notes/editable-content';
import { useState } from 'react';

export const Route = createFileRoute('/app/notes/$noteId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { noteId } = useParams({ from: '/app/notes/$noteId' });
  const { data: note, isLoading, error } = useGetNote(noteId);
  const updateNoteMutation = useUpdateNote();
  const [isTitlePending, setIsTitlePending] = useState(false);
  const [isContentPending, setIsContentPending] = useState(false);

  const handleTitleSave = (newTitle: string) => {
    if (note && newTitle !== note.title) {
      updateNoteMutation.mutate({
        ...note,
        title: newTitle,
      });
    }
  };

  const handleContentSave = (newContent: string) => {
    if (note && newContent !== note.content) {
      updateNoteMutation.mutate({
        ...note,
        content: newContent,
      });
    }
  };

  if (error) return <div>Error: {error.message}</div>;
  if (!note && !isLoading) return <div>Note not found</div>;

  const isSaving =
    updateNoteMutation.isPending || isTitlePending || isContentPending;

  return (
    <div className="relative flex flex-col gap-4">
      <div className="text-muted-foreground px-4 pt-4 text-sm md:px-10">
        {isSaving ? <span>Saving...</span> : <span>Saved</span>}
      </div>
      <div className="relative flex flex-col gap-10 p-4 md:p-10">
        {isLoading ? (
          <Skeleton className="h-10 w-56" />
        ) : (
          <EditableTitle
            value={note?.title || ''}
            onSave={handleTitleSave}
            onPendingChange={setIsTitlePending}
          />
        )}

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-7 w-full" />
            ))}
          </div>
        ) : (
          <EditableContent
            value={note?.content || ''}
            onSave={handleContentSave}
            onPendingChange={setIsContentPending}
          />
        )}
      </div>
    </div>
  );
}
