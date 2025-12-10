import { handleResponse } from '@/lib/api';
import type { Note } from '@/types/notes';

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/notes`
  : 'http://localhost:3000/api/notes';

export const getNotes = async (): Promise<Note[]> => {
  const response = await fetch(`${API_BASE_URL}/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse<Note[]>(response);
};

export const getNote = async (id: string): Promise<Note> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse<Note>(response);
};

export const createNote = async (
  note: Pick<Note, 'title' | 'content'>
): Promise<Note> => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(note),
  });
  return handleResponse<Note>(response);
};

export const updateNote = async (note: Note): Promise<Note> => {
  const response = await fetch(`${API_BASE_URL}/${note.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(note),
  });

  return handleResponse<Note>(response);
};

export const deleteNote = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse<void>(response);
};
