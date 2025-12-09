const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface AuthResponse {
  user: { id: string; username: string };
}

interface ErrorResponse {
  message: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
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
}

export async function loginRequest(
  username: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  return handleResponse<AuthResponse>(response);
}

export async function signupRequest(
  username: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  return handleResponse<AuthResponse>(response);
}

interface MeResponse {
  user: { id: string; username: string };
}

export async function checkAuthRequest(): Promise<MeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return handleResponse<MeResponse>(response);
}

interface LogoutResponse {
  message: string;
}

export async function logoutRequest(): Promise<LogoutResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return handleResponse<LogoutResponse>(response);
}
