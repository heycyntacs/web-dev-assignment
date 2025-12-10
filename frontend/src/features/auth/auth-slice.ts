import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginRequest, signupRequest, logoutRequest } from '@/api/auth';

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const AUTH_STORAGE_KEY = 'auth_state';

// Load initial state from localStorage (only user, not token)
const loadAuthState = (): Pick<AuthState, 'user'> => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user || null,
      };
    }
  } catch {
    // Ignore errors
  }
  return { user: null };
};

const initialState: AuthState = {
  ...loadAuthState(),
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (
    payload: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginRequest(payload.username, payload.password);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (
    payload: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await signupRequest(payload.username, payload.password);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Signup failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutRequest();
      return;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Logout failed';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem(AUTH_STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        // Persist user to localStorage (token is in HTTP-only cookie)
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            user: action.payload.user,
          })
        );
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        // Persist user to localStorage (token is in HTTP-only cookie)
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            user: action.payload.user,
          })
        );
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Still clear user on logout error
        state.user = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
