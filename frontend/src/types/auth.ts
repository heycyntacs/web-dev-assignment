export interface AuthResponse {
  user: { id: string; username: string };
}

export interface MeResponse {
  user: { id: string; username: string };
}

export interface LogoutResponse {
  message: string;
}
