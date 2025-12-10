import type { ErrorResponse } from '@/types/api';

export const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    const errorData: ErrorResponse = isJson
      ? await response.json()
      : { message: response.statusText || 'An error occurred' };
    throw new Error(errorData.message);
  }

  if (isJson) {
    return response.json();
  }

  throw new Error('Invalid response format');
};
