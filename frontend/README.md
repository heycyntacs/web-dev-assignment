# Frontend - Notely

A modern React application built with TypeScript, TanStack Router, Redux Toolkit, and Tailwind CSS for managing notes.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Integration](#api-integration)
- [Assumptions and Decisions](#assumptions-and-decisions)

## Setup Instructions

### Prerequisites

- Node.js (v22 or higher)
- npm

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env` file in the `frontend` directory with the following variables:

```env
# Backend API URL
VITE_API_URL="http://localhost:3000"
```

**Note:** If `VITE_API_URL` is not set, the application defaults to `http://localhost:3000`.

3. **Start the development server:**

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or the next available port).

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist` directory.

### Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## API Integration

The frontend communicates with the backend API through the following modules:

### Authentication API (`src/api/auth.ts`)

- `loginRequest(username, password)` - Authenticate user
- `signupRequest(username, password)` - Create new user account
- `checkAuthRequest()` - Get current authenticated user
- `logoutRequest()` - Log out current user

### Notes API (`src/api/notes.ts`)

- `getNotes()` - Fetch all notes for the current user
- `getNote(id)` - Fetch a single note by ID
- `createNote(note)` - Create a new note
- `updateNote(note)` - Update an existing note
- `deleteNote(id)` - Delete a note

### API Configuration

All API requests:

- Include credentials (cookies) for authentication
- Use the `VITE_API_URL` environment variable for the base URL
- Handle errors through a centralized `handleResponse` utility
- Automatically include the `auth_token` cookie set by the backend

### Example API Usage

```typescript
import { loginRequest } from '@/api/auth';
import { getNotes, createNote } from '@/api/notes';

// Login
const authResponse = await loginRequest('username', 'password');

// Get all notes
const notes = await getNotes();

// Create a note
const newNote = await createNote({
  title: 'My Note',
  content: 'Note content',
});
```

## Assumptions and Decisions

### Architecture

1. **TanStack Router:**
   - File-based routing for better organization
   - Type-safe routing with automatic code splitting
   - Route-based code organization in `src/routes/`

2. **State Management:**
   - **Redux Toolkit** for global application state (auth, sidebar)
   - **React Query (TanStack Query)** for server state management (notes data)
   - Separation of concerns: client state vs. server state

3. **Component Structure:**
   - Feature-based organization (`components/notes/`, `components/forms/`)
   - Reusable UI components in `components/ui/`
   - Common/shared components in `components/common/`

### User Experience

1. **Real-time Updates:**
   - Debounced auto-save for note content (using `use-debounce`)
   - Optimistic updates for better perceived performance
   - Loading states and error boundaries for better UX

2. **Form Handling:**
   - React Hook Form for form state management
   - Zod for schema validation
   - Consistent form patterns through custom hooks (`form-hooks.tsx`)

3. **Error Handling:**
   - Error boundaries to catch React errors
   - Toast notifications (Sonner) for user feedback
   - Graceful error handling in API calls

### Styling

1. **Tailwind CSS:**
   - Utility-first CSS framework for rapid development
   - Custom configuration with `@tailwindcss/vite`
   - Consistent design system using `cn()` utility for conditional classes

2. **UI Components:**
   - Custom components built on top of Shadcn and Radix UI
   - Consistent styling patterns across the application

### Authentication

1. **Cookie-based Authentication:**
   - Relies on HTTP-only cookies set by the backend
   - Automatic cookie handling via `credentials: 'include'`

2. **Route Protection:**
   - Protected routes require authentication
   - Automatic redirect to login if not authenticated
   - Auth state managed in Redux store

3. **Session Management:**
   - `checkAuthRequest()` on app initialization to verify session
   - Automatic logout on authentication errors

### Notes Management

1. **Editable Components:**
   - Inline editing for both title and content
   - Auto-save functionality with debouncing
   - Visual feedback during save operations

2. **Data Fetching:**
   - React Query for caching and automatic refetching
   - Optimistic updates for immediate UI feedback
   - Background refetching for data freshness

3. **Sidebar Navigation:**
   - Real-time note list updates
   - Active note highlighting
   - Delete confirmation dialogs for safety

### Development Practices

1. **TypeScript:**
   - Strict type checking enabled
   - Type-safe API calls and responses

2. **Code Organization:**
   - Path aliases (`@/`) for cleaner imports
   - Separation of concerns (hooks, components, API, types)
   - Reusable hooks for common patterns

### Environment Configuration

1. **Vite Environment Variables:**
   - All environment variables prefixed with `VITE_`
   - Default fallback values for development

### Security Considerations

1. **XSS Prevention:**
   - No manual token storage (relies on HTTP-only cookies)
   - Proper sanitization of user input
   - React's built-in XSS protection

2. **CSRF Protection:**
   - SameSite cookie policy handled by backend
   - Credentials included in all API requests

### Accessibility

1. **Shadcn / Radix UI:**
   - Accessible components out of the box
   - Keyboard navigation support
   - ARIA attributes properly set

2. **Form Accessibility:**
   - Proper label associations
   - Error message announcements
   - Focus management

### State Management Decisions

1. **Why Redux for Auth:**
   - Auth state needs to be accessible across the entire app
   - Predictable state updates
   - DevTools for debugging

2. **Why React Query for Notes:**
   - Server state caching and synchronization
   - Automatic background refetching
   - Built-in loading and error states
   - Optimistic updates support

3. **Why Local State for Forms:**
   - Form state is component-specific
   - React Hook Form handles form state efficiently
   - No need for global state management

### Routing Structure

```
/                    → Root (redirects based on auth)
/login               → Login page
/signup              → Signup page
/app                 → Protected app layout
/app/notes           → Notes list (redirects to first note or /new)
/app/notes/new       → Create new note
/app/notes/:noteId    → View/edit specific note
```

### Build and Deployment

1. **Vite Build:**
   - Optimized production builds
   - Automatic code splitting
   - Asset optimization

2. **Static Assets:**
   - All assets are bundled and optimized
   - Path aliases resolved in build
   - TypeScript compilation before build
