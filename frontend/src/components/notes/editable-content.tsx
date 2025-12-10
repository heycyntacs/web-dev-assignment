import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { cn } from '@/lib/utils';

interface EditableContentProps {
  value: string;
  onSave: (value: string) => void;
  onPendingChange?: (isPending: boolean) => void;
  className?: string;
}

export function EditableContent({
  value,
  onSave,
  onPendingChange,
  className,
}: EditableContentProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasPendingChangesRef = useRef(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [localValue, isEditing]);

  const debouncedSave = useDebouncedCallback((newValue: string) => {
    if (newValue !== value) {
      onSave(newValue);
      hasPendingChangesRef.current = false;
      onPendingChange?.(false);
    }
  }, 500);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);

    // Track pending changes
    const hasChanges = newValue !== value;
    if (hasChanges && !hasPendingChangesRef.current) {
      hasPendingChangesRef.current = true;
      onPendingChange?.(true);
    } else if (!hasChanges && hasPendingChangesRef.current) {
      hasPendingChangesRef.current = false;
      onPendingChange?.(false);
    }

    // Debounce save
    debouncedSave(newValue);
  };

  const handleBlur = () => {
    // Cancel pending debounced save and save immediately
    debouncedSave.cancel();

    if (localValue !== value) {
      onSave(localValue);
      hasPendingChangesRef.current = false;
      onPendingChange?.(false);
    }

    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setLocalValue(value);
      setIsEditing(false);
      hasPendingChangesRef.current = false;
      onPendingChange?.(false);
      textareaRef.current?.blur();
    }
    // Allow Tab key for indentation
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue =
          localValue.substring(0, start) + '  ' + localValue.substring(end);
        setLocalValue(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
    }
  };

  return (
    <div className="relative">
      <textarea
        id="content"
        name="content"
        ref={textareaRef}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full resize-none overflow-hidden border-none bg-transparent outline-none',
          'text-muted-foreground md:text-lg',
          'focus:outline-none',
          'placeholder:text-muted-foreground/50',
          'min-h-[200px]',
          className
        )}
        placeholder="Start writing..."
        rows={1}
      />
    </div>
  );
}
