import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from '@/api/notes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
  });
};

export const useGetNote = (id: string) => {
  return useQuery({
    queryKey: ['note', id],
    queryFn: () => getNote(id),
  });
};

export const useCreateNote = (options?: { showToast?: boolean }) => {
  const queryClient = useQueryClient();
  const showToast = options?.showToast ?? false;

  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      if (showToast) {
        toast.success('Note created successfully');
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create note');
    },
  });
};

export const useUpdateNote = (options?: { showToast?: boolean }) => {
  const queryClient = useQueryClient();
  const showToast = options?.showToast ?? false;

  return useMutation({
    mutationFn: updateNote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', data.id] });
      if (showToast) {
        toast.success('Note updated successfully');
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update note');
    },
  });
};

export const useDeleteNote = (options?: {
  onSuccess?: (deletedNoteId: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: (_, deletedNoteId) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', deletedNoteId] });
      toast.success('Note deleted successfully');
      options?.onSuccess?.(deletedNoteId);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete note');
    },
  });
};
