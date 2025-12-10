# Notely - Full-Stack Notes Management Application

A modern full-stack web application for managing notes with user authentication, real-time updates, and a clean, intuitive interface.

## Overview

Notely is a notes management application built with a React frontend and Express.js backend. It features user authentication, CRUD operations for notes, auto-save functionality, and a responsive design. The application is fully containerized with Docker and includes CI/CD pipelines.

## Features

- 🔐 **User Authentication** - Secure signup and login with JWT tokens stored in HTTP-only cookies
- 📝 **Notes Management** - Create, read, update, and delete notes
- ⚡ **Real-time Updates** - Auto-save functionality with debounced updates
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI components
- 🔒 **Secure** - HTTP-only cookies, password hashing, and authorization checks
- 🐳 **Dockerized** - Full Docker Compose support for easy deployment
- 🔄 **Type-Safe** - Full TypeScript implementation across the stack
- 🚀 **CI/CD** - Automated testing and deployment pipelines

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **TanStack Router** - Type-safe file-based routing
- **Redux Toolkit** - Global state management
- **TanStack Query (React Query)** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI / Shadcn** - Accessible UI components
- **Vite** - Build tool and dev server

### Backend

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Relational database
- **Prisma** - Type-safe ORM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### DevOps

- **Docker** & **Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipelines
- **Nginx** - Production web server (frontend)

## Project Structure

```
web-dev-assignment/
├── backend/          # Express.js API server
│   ├── src/         # TypeScript source files
│   ├── prisma/      # Database schema and migrations
│   └── dist/        # Compiled JavaScript (production)
├── frontend/         # React application
│   ├── src/         # React source files
│   └── dist/        # Built static files (production)
├── docker-compose.yml           # Production Docker setup
├── docker-compose.dev.yml       # Development Docker setup
├── docker-compose.postgres.yml  # Standalone PostgreSQL
└── DOCKER.md        # Docker documentation
```

## Quick Start

### Prerequisites

- **Node.js** v22 or higher
- **npm** v9 or higher
- **PostgreSQL** (or use Docker Compose)
- **Docker** & **Docker Compose** (optional, for containerized setup)

### Option 1: Docker Setup (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Production setup
docker-compose up -d

# Development setup with hot-reload
docker-compose -f docker-compose.dev.yml up -d

# Standalone database only
docker-compose -f docker-compose.postgres.yml up -d
```

For detailed Docker instructions, see [DOCKER.md](./DOCKER.md).

### Option 2: Local Development Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd web-dev-assignment
   ```

2. **Install dependencies:**

   ```bash
   npm run install:all
   ```

3. **Set up the database:**

   ```bash
   # Start PostgreSQL (or use Docker Compose)
   docker-compose -f docker-compose.postgres.yml up -d

   # Or use your local PostgreSQL instance
   ```

4. **Configure environment variables:**

   **Backend** (`backend/.env`):

   ```env
   DATABASE_URL="postgresql://postgres:prisma@localhost:5433/postgres?schema=public"
   JWT_SECRET="your-secret-key-change-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:5173"
   ```

   **Frontend** (`frontend/.env`):

   ```env
   VITE_API_URL="http://localhost:3000"
   ```

5. **Set up the database:**

   ```bash
   cd backend
   npm run generate  # Generate Prisma client
   npm run migrate   # Run database migrations
   npm run seed      # Seed with sample data (optional)
   cd ..
   ```

6. **Start the development servers:**

   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start them separately:
   npm run dev:backend   # Backend on http://localhost:3000
   npm run dev:frontend  # Frontend on http://localhost:5173
   ```

7. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health

### Test Accounts

The seed script creates test users you can use:

- **Username:** `alice`, **Password:** `password123`
- **Username:** `bob`, **Password:** `password123`
- **Username:** `charlie`, **Password:** `password123`

## Available Scripts

### Root Level Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run start` - Start the production backend server
- `npm run migrate` - Run database migrations
- `npm run migrate:deploy` - Deploy migrations (production)
- `npm run generate` - Generate Prisma client
- `npm run seed` - Seed the database with sample data
- `npm run lint` - Run ESLint on frontend code
- `npm run install:all` - Install dependencies for both frontend and backend

### Backend Scripts

See [backend/README.md](./backend/README.md) for detailed backend scripts.

### Frontend Scripts

See [frontend/README.md](./frontend/README.md) for detailed frontend scripts.

## Documentation

- **[Backend README](./backend/README.md)** - Backend API documentation, setup instructions, and architecture decisions
- **[Frontend README](./frontend/README.md)** - Frontend setup, routing, and component architecture
- **[Docker Documentation](./DOCKER.md)** - Comprehensive Docker setup guide and deployment instructions

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Log out user

### Notes

- `GET /api/notes/list` - Get all notes for authenticated user
- `GET /api/notes/:id` - Get single note by ID
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update existing note
- `DELETE /api/notes/:id` - Delete note

### Health Check

- `GET /health` - Server health status

For detailed API documentation, see [backend/README.md](./backend/README.md#api-documentation).

## Environment Variables

### Backend

| Variable         | Required | Default                   | Description                      |
| ---------------- | -------- | ------------------------- | -------------------------------- |
| `DATABASE_URL`   | ✅ Yes   | -                         | PostgreSQL connection string     |
| `JWT_SECRET`     | ✅ Yes   | -                         | Secret key for JWT token signing |
| `JWT_EXPIRES_IN` | ❌ No    | `"7d"`                    | JWT token expiration time        |
| `PORT`           | ❌ No    | `3000`                    | Server port number               |
| `NODE_ENV`       | ❌ No    | `"development"`           | Environment mode                 |
| `FRONTEND_URL`   | ❌ No    | `"http://localhost:5173"` | Frontend URL for CORS            |

### Frontend

| Variable       | Required | Default                   | Description          |
| -------------- | -------- | ------------------------- | -------------------- |
| `VITE_API_URL` | ❌ No    | `"http://localhost:3000"` | Backend API base URL |

## Security Considerations

- 🔒 **HTTP-Only Cookies** - JWT tokens stored in HTTP-only cookies to prevent XSS attacks
- 🔐 **Password Hashing** - Passwords hashed using bcrypt with 10 salt rounds
- 🛡️ **Authorization** - Users can only access and modify their own notes
- 🔑 **Secure Configuration** - Environment variables for sensitive data
- 🚫 **CSRF Protection** - SameSite cookie policy enabled

## Development Workflow

1. **Make changes** to the codebase
2. **Test locally** using `npm run dev`
3. **Run linter** using `npm run lint`
4. **Commit changes** (following conventional commits)
5. **Push to repository** - CI/CD pipeline automatically runs tests and builds

## CI/CD Pipeline

The project includes GitHub Actions workflows that:

- Build and test the application on every push and pull request
- Run type checking and linting
- Build Docker images
- Push images to container registry

See `.github/workflows/ci-cd.yml` for details.

## Production Deployment

For production deployment:

1. Set up environment variables in your deployment environment
2. Use strong, randomly generated `JWT_SECRET`
3. Configure `DATABASE_URL` with SSL enabled
4. Set `NODE_ENV=production`
5. Use Docker Compose for easy deployment:
   ```bash
   docker-compose up -d
   ```

See [DOCKER.md](./DOCKER.md) for detailed production deployment instructions.

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Run linting: `npm run lint`
5. Commit following conventional commits format
6. Push and create a pull request

## License

Private project - Not for public use.

## Support

For issues and questions:

- Check the [Backend README](./backend/README.md) for backend-related questions
- Check the [Frontend README](./frontend/README.md) for frontend-related questions
- Check the [Docker Documentation](./DOCKER.md) for Docker-related questions
