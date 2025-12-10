# Backend - Notely

A RESTful API backend built with Express.js, TypeScript, and PostgreSQL for a notes management application.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
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
# Database
DATABASE_URL="postgres://44628f2fb9a7af105a0915c5e4d3b65e444441c6afea4e08ecab7c9f5f48a6d1:sk_d7-Iziv1qzgTWu_61OJEK@db.prisma.io:5432/postgres?sslmode=require"

# JWT Configuration
JWT_SECRET="c6e8637f5ff4c449bb615bce04d20f24"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

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

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:deploy` - Deploy migrations (for production)
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

2. **Code Organization:**
   - Separation of concerns: routes, controllers, middleware, and utilities
   - Type definitions in dedicated `types` directory

3. **Environment Variables:**
   - All configuration is externalized to environment variables
   - Sensitive values (JWT_SECRET, DATABASE_URL) must be set in `.env`

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
