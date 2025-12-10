import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { cn } from '@/lib/utils';

interface EditableTitleProps {
  value: string;
  onSave: (value: string) => void;
  onPendingChange?: (isPending: boolean) => void;
  className?: string;
}

export function EditableTitle({
  value,
  onSave,
  onPendingChange,
  className,
}: EditableTitleProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasPendingChangesRef = useRef(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const debouncedSave = useDebouncedCallback(
    (newValue: string) => {
      if (newValue !== value && newValue.trim() !== '') {
        onSave(newValue.trim());
        hasPendingChangesRef.current = false;
        onPendingChange?.(false);
      }
    },
    500
  );

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);

    // Track pending changes
    const hasChanges = newValue.trim() !== value && newValue.trim() !== '';
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

    const trimmedValue = localValue.trim();
    if (trimmedValue !== value && trimmedValue !== '') {
      onSave(trimmedValue);
      hasPendingChangesRef.current = false;
      onPendingChange?.(false);
    } else if (trimmedValue === '') {
      // Reset to original value if empty
      setLocalValue(value);
      hasPendingChangesRef.current = false;
      onPendingChange?.(false);
    }

    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setLocalValue(value);
      setIsEditing(false);
      hasPendingChangesRef.current = false;
      onPendingChange?.(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      <textarea
        id="title"
        name="title"
        ref={inputRef}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full resize-none border-none bg-transparent outline-none',
          'text-2xl font-bold md:text-4xl',
          'focus:outline-none',
          'placeholder:text-muted-foreground/50',
          className
        )}
        placeholder="Untitled"
      />
    </div>
  );
}
