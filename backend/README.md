# Backend - Notely

A RESTful API backend built with Express.js, TypeScript, and PostgreSQL for a notes management application.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [CI/CD Pipeline](#cicd-pipeline)
- [Assumptions and Decisions](#assumptions-and-decisions)

## Setup Instructions

### Prerequisites

- Node.js (v22 or higher)
- PostgreSQL
- npm
- Prisma

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database (Required)
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/notely?schema=public"

# JWT Configuration
# Secret key for signing JWT tokens (Required)
# Generate a strong random string for production
JWT_SECRET="your-secret-key-change-in-production"
# Token expiration time (Optional, defaults to "7d")
JWT_EXPIRES_IN="7d"

# Server Configuration
# Port number (Optional, defaults to 3000)
PORT=3000
# Environment: "development" or "production" (Optional, defaults to "development")
NODE_ENV="development"

# Frontend URL (Optional, defaults to "http://localhost:5173")
# Used for CORS configuration
FRONTEND_URL="http://localhost:5173"
```

### Environment Variable Details

| Variable         | Required | Default                   | Description                                                                                         |
| ---------------- | -------- | ------------------------- | --------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`   | ✅ Yes   | -                         | PostgreSQL connection string. Format: `postgresql://user:password@host:port/database?schema=public` |
| `JWT_SECRET`     | ✅ Yes   | -                         | Secret key for signing and verifying JWT tokens. Use a strong random string in production.          |
| `JWT_EXPIRES_IN` | ❌ No    | `"7d"`                    | JWT token expiration time. Examples: `"1h"`, `"7d"`, `"30d"`                                        |
| `PORT`           | ❌ No    | `3000`                    | Port number for the server to listen on                                                             |
| `NODE_ENV`       | ❌ No    | `"development"`           | Environment mode. Affects error stack traces and cookie security settings                           |
| `FRONTEND_URL`   | ❌ No    | `"http://localhost:5173"` | Frontend URL for CORS configuration. Should match your frontend's URL                               |

**Security Notes:**

- Never commit `.env` files to version control
- Use strong, randomly generated values for `JWT_SECRET` in production
- In production, set `NODE_ENV=production` to enable secure cookie flags
- Ensure `DATABASE_URL` uses SSL in production (`?sslmode=require`)

3. **Set up the database:**

```bash
# Generate Prisma client
npm run generate

# Run database migrations
npm run migrate

# (Optional) Seed the database with sample data
npm run seed
```

#### Seed Data for Testing

The seed script creates test users and sample notes for testing purposes:

**Test Users:**

- Username: `alice`, Password: `password123`
  - 4 notes including "Welcome to My Notes", "Shopping List", "Meeting Notes", and an empty note
- Username: `bob`, Password: `password123`
  - 2 notes including "Project Ideas" and "Book Recommendations"
- Username: `charlie`, Password: `password123`
  - 1 note: "Daily Journal"

You can use these credentials to log in and test the application. All three users have the same password (`password123`) for convenience during development and testing.

4. **Start the development server:**

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Start the production server
npm start
```

### Available Scripts

- `npm run dev` - Start development server with hot reload using nodemon and tsx
- `npm run build` - Compile TypeScript to JavaScript (outputs to `dist/`)
- `npm start` - Start production server from compiled JavaScript
- `npm run migrate` - Run database migrations in development mode
- `npm run migrate:deploy` - Deploy migrations (for production)
- `npm run db:deploy` - Alias for `migrate:deploy`
- `npm run generate` - Generate Prisma client
- `npm run seed` - Seed the database with sample data

## API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

All endpoints except `/api/auth/login` and `/api/auth/signup` require authentication. Authentication is handled via HTTP-only cookies containing a JWT token.

The JWT token is automatically set in a cookie named `auth_token` upon successful login or signup.

### Endpoints

#### Health Check

**GET** `/health`

Check if the server is running.

**Response:**

```json
{
  "status": "ok"
}
```

---

#### Authentication Endpoints

##### Sign Up

**POST** `/api/auth/signup`

Create a new user account.

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Validation Rules:**

- Username: 2-50 characters, case-insensitive (stored in lowercase)
- Password: Minimum 8 characters

**Response (201):**

```json
{
  "user": {
    "id": "uuid",
    "username": "johndoe"
  }
}
```

**Error Responses:**

- `400` - Validation error
- `409` - Username already exists

---

##### Login

**POST** `/api/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "username": "johndoe"
  }
}
```

**Error Responses:**

- `400` - Validation error
- `401` - Invalid username or password

**Note:** The JWT token is automatically set as an HTTP-only cookie.

---

##### Get Current User

**GET** `/api/auth/me`

Get the currently authenticated user's information.

**Headers:**

- Cookie: `auth_token` (automatically sent by browser)

**Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "username": "johndoe"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `404` - User not found

---

##### Logout

**POST** `/api/auth/logout`

Log out the current user (clears the auth cookie).

**Headers:**

- Cookie: `auth_token` (automatically sent by browser)

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**

- `401` - Not authenticated

---

#### Notes Endpoints

All notes endpoints require authentication.

##### Get All Notes

**GET** `/api/notes/list`

Retrieve all notes for the authenticated user.

**Headers:**

- Cookie: `auth_token` (automatically sent by browser)

**Response (200):**

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "title": "My Note",
    "content": "Note content here",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**

- `401` - Not authenticated

---

##### Get Single Note

**GET** `/api/notes/:id`

Retrieve a specific note by ID.

**Headers:**

- Cookie: `auth_token` (automatically sent by browser)

**Parameters:**

- `id` (path parameter) - Note UUID

**Response (200):**

```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "My Note",
  "content": "Note content here",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `401` - Not authenticated
- `404` - Note not found

---

##### Create Note

**POST** `/api/notes`

Create a new note.

**Headers:**

- Cookie: `auth_token` (automatically sent by browser)
- Content-Type: `application/json`

**Request Body:**

```json
{
  "title": "New Note",
  "content": "Note content (optional)"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "New Note",
  "content": "Note content",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": null
}
```

**Error Responses:**

- `400` - Validation error
- `401` - Not authenticated

---

##### Update Note

**PUT** `/api/notes/:id`

Update an existing note. Only the note owner can update their notes.

**Headers:**

- Cookie: `auth_token` (automatically sent by browser)
- Content-Type: `application/json`

**Parameters:**

- `id` (path parameter) - Note UUID

**Request Body:**

```json
{
  "title": "Updated Note",
  "content": "Updated content"
}
```

**Response (200):**

```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Updated Note",
  "content": "Updated content",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T01:00:00.000Z"
}
```

**Error Responses:**

- `401` - Not authenticated
- `404` - Note not found (or note doesn't belong to user)

---

##### Delete Note

**DELETE** `/api/notes/:id`

Delete a note. Only the note owner can delete their notes.

**Headers:**

- Cookie: `auth_token` (automatically sent by browser)

**Parameters:**

- `id` (path parameter) - Note UUID

**Response (200):**

```json
{
  "message": "Note deleted successfully"
}
```

**Error Responses:**

- `401` - Not authenticated
- `404` - Note not found (or note doesn't belong to user)

---

### Error Response Format

All error responses follow this format:

```json
{
  "message": "Error message here"
}
```

In development mode, the response may also include a `stack` field with the error stack trace.

---

## CI/CD Pipeline

The backend includes automated CI/CD via GitHub Actions that runs on every push and pull request to `main` and `develop` branches.

### Pipeline Jobs

1. **Build Backend:**
   - Installs dependencies using `npm ci`
   - Generates Prisma client
   - Compiles TypeScript to JavaScript
   - Validates type checking

### Requirements

- Node.js 22
- All dependencies must be installable
- TypeScript compilation must succeed
- Prisma client generation must complete

### Environment Variables in CI

The CI pipeline uses placeholder environment variables for Prisma generation:

- `DATABASE_URL` - PostgreSQL connection string (placeholder for build)
- `NODE_ENV` - Set to `production`
- `JWT_SECRET` - Placeholder value
- `JWT_EXPIRES_IN` - Defaults to `7d`
- `FRONTEND_URL` - Defaults to `http://localhost:80`

**Note:** These are only used for building and type checking. Actual runtime environment variables should be configured in your deployment environment.

---

## Assumptions and Decisions

### Security

1. **HTTP-Only Cookies for JWT Tokens:**
   - JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
   - Cookies are set with `secure` flag in production and `sameSite: 'lax'` for CSRF protection

2. **Password Hashing:**
   - Passwords are hashed using bcrypt with 10 salt rounds
   - Passwords are never returned in API responses

3. **Username Normalization:**
   - Usernames are stored in lowercase to ensure case-insensitive uniqueness
   - Usernames are validated to be 2-50 characters long

4. **Authorization:**
   - Users can only access and modify their own notes
   - All note operations verify ownership through the `userId` field

### Database

1. **Prisma ORM:**
   - Prisma is used for type-safe database access
   - Custom output path (`src/generated/prisma`) is used to keep generated code organized

2. **PostgreSQL:**
   - PostgreSQL is chosen for its reliability and support for complex queries
   - UUIDs are used as primary keys for better distribution and security

3. **Note Timestamps:**
   - `createdAt` is automatically set on creation
   - `updatedAt` is only set when a note is actually updated (nullable by default)

4. **Type Safety:**
   - All `@types/*` packages are included in devDependencies
   - TypeScript configuration ensures proper type resolution
   - Custom type definitions for authenticated requests

### API Design

1. **RESTful Conventions:**
   - Standard HTTP methods (GET, POST, PUT, DELETE) are used
   - Resource-based URLs (`/api/notes/:id`)
   - Appropriate HTTP status codes

2. **Error Handling:**
   - Centralized error handling middleware
   - Consistent error response format
   - Detailed error messages in development, generic messages in production

3. **CORS Configuration:**
   - CORS is configured to allow requests from the frontend URL
   - Credentials are enabled for cookie-based authentication

### Development

1. **TypeScript:**
   - Full TypeScript implementation for type safety
   - Strict type checking enabled
   - Target: ES2018 (supports Promise.finally and modern features)
   - Type definitions explicitly configured via `typeRoots`

2. **Code Organization:**
   - Separation of concerns: routes, controllers, middleware, and utilities
   - Type definitions in dedicated `types` directory
   - Prisma client generated to `src/generated/prisma` for better organization

3. **Environment Variables:**
   - All configuration is externalized to environment variables
   - Sensitive values (JWT_SECRET, DATABASE_URL) must be set in `.env`

4. **Development Tools:**
   - `tsx` for running TypeScript directly without compilation
   - `nodemon` for automatic server restart on file changes
   - `debug` package for conditional logging (set `DEBUG=backend:*` to enable)

### Authentication Flow

1. **Token Expiration:**
   - JWT tokens expire after 7 days (configurable via `JWT_EXPIRES_IN`)
   - Users must re-authenticate after token expiration

2. **User Verification:**
   - The `verifyUser` function is called on protected routes to ensure the user still exists
   - This prevents issues with deleted users having valid tokens

### Notes Management

1. **Content Field:**
   - Note content is optional (nullable) to allow title-only notes
   - Title is required for all notes

2. **Ordering:**
   - Notes are returned in descending order by creation date (newest first)

3. **Update Behavior:**
   - Both title and content can be updated
   - `updatedAt` timestamp is automatically set on update
