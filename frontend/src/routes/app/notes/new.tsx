import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { EditableTitle } from '@/components/notes/editable-title';
import { EditableContent } from '@/components/notes/editable-content';
import { useCreateNote } from '@/hooks/notes-hooks';
import { useState, useRef, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const Route = createFileRoute('/app/notes/new')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const createNoteMutation = useCreateNote();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isTitlePending, setIsTitlePending] = useState(false);
  const [isContentPending, setIsContentPending] = useState(false);
  const [hasBeenCreated, setHasBeenCreated] = useState(false);
  const hasBeenCreatedRef = useRef(false);

  // Use refs to track latest values to avoid stale closures
  const titleRef = useRef('');
  const contentRef = useRef('');

  // Keep refs in sync with state
  useEffect(() => {
    hasBeenCreatedRef.current = hasBeenCreated;
    titleRef.current = title;
    contentRef.current = content;
  }, [hasBeenCreated, title, content]);

  const createNote = useDebouncedCallback(() => {
    if (hasBeenCreatedRef.current || createNoteMutation.isPending) return;

    // Use refs to get the latest values at the time of creation
    const currentTitle = titleRef.current.trim() || 'Untitled';
    const currentContent = contentRef.current.trim() || '';

    const noteData = {
      title: currentTitle,
      content: currentContent,
    };

    // Only create if there's actual content
    if (noteData.title !== 'Untitled' || noteData.content !== '') {
      hasBeenCreatedRef.current = true;
      setHasBeenCreated(true);
      createNoteMutation.mutate(noteData, {
        onSuccess: (createdNote) => {
          // Navigate to the created note
          navigate({
            to: '/app/notes/$noteId',
            params: { noteId: createdNote.id },
          });
        },
      });
    }
  }, 1500);

  const handleTitleSave = (newTitle: string) => {
    setTitle(newTitle);
    // Update ref immediately to ensure latest value is captured
    titleRef.current = newTitle;
    // Auto-create note if it has content or title
    if (
      !hasBeenCreatedRef.current &&
      (newTitle.trim() !== '' || contentRef.current.trim() !== '')
    ) {
      createNote();
    }
  };

  const handleContentSave = (newContent: string) => {
    setContent(newContent);
    // Update ref immediately to ensure latest value is captured
    contentRef.current = newContent;
    // Auto-create note if it has content or title
    if (
      !hasBeenCreatedRef.current &&
      (titleRef.current.trim() !== '' || newContent.trim() !== '')
    ) {
      createNote();
    }
  };

  const isSaving =
    createNoteMutation.isPending || isTitlePending || isContentPending;

  return (
    <div className="relative flex flex-col gap-4">
      <div className="text-muted-foreground px-4 pt-4 text-sm md:px-10">
        {isSaving ? (
          <span>Saving...</span>
        ) : hasBeenCreated ? (
          <span>Saved</span>
        ) : null}
      </div>
      <div className="relative flex flex-col gap-10 p-4 md:p-10">
        <EditableTitle
          value={title}
          onSave={handleTitleSave}
          onPendingChange={setIsTitlePending}
        />

        <EditableContent
          value={content}
          onSave={handleContentSave}
          onPendingChange={setIsContentPending}
        />
      </div>
    </div>
  );
}
