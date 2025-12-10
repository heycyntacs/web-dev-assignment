# Docker Setup Guide

This guide explains how to containerize and run the application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10 or later
- Docker Compose 2.0 or later

## Docker Compose Files

This project includes three Docker Compose configurations for different use cases:

### 1. `docker-compose.yml` - Production Setup

Full production stack with all services (PostgreSQL, Backend, Frontend).

**Usage:**

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

**Services:**

- `postgres`: PostgreSQL 16-alpine database
- `backend`: Production backend service (multi-stage build)
- `frontend`: Production frontend service (Nginx)

**Ports:**

- Frontend: `80`
- Backend: `3000`
- PostgreSQL: `5432`

### 2. `docker-compose.dev.yml` - Development Setup

Development environment with hot-reload support for backend and frontend development.

**Usage:**

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

**Services:**

- `postgres_db`: PostgreSQL 16-alpine database (port `5432`)
- `server`: Development backend with hot-reload (uses `Dockerfile.dev`)

**Features:**

- Volume mounting for live code changes
- Hot-reload enabled
- Interactive terminal support (`stdin_open` and `tty`)

### 3. `docker-compose.postgres.yml` - Standalone Database

Standalone PostgreSQL database for local development when running backend/frontend outside Docker.

**Usage:**

```bash
# Start only PostgreSQL
docker-compose -f docker-compose.postgres.yml up -d

# Stop PostgreSQL
docker-compose -f docker-compose.postgres.yml down
```

**Service:**

- `postgres`: PostgreSQL 16-alpine database (port `5433` to avoid conflicts with local PostgreSQL)

**Note:** This uses port `5433` to avoid conflicts if you have a local PostgreSQL instance running on port `5432`.

## Environment Variables

### Production (docker-compose.yml)

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=webdev
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/webdev?schema=public

# Backend Configuration
NODE_ENV=production
BACKEND_PORT=3000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:80

# Frontend Configuration
FRONTEND_PORT=80
VITE_API_URL=http://localhost:3000
```

### Development (docker-compose.dev.yml)

The development setup uses hardcoded values in the compose file:

- Database: `postgres`
- User: `postgres`
- Password: `prisma`
- Port: `5432`

The `DATABASE_URL` is automatically set to: `postgresql://postgres:prisma@postgres_db:5432/postgres?schema=public`

### Standalone PostgreSQL (docker-compose.postgres.yml)

For local development, create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://postgres:prisma@localhost:5433/postgres?schema=public
```

**Important**: Change `JWT_SECRET` to a secure random string in production!

## Quick Start

### Production Setup

```bash
# Build and start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:80
# Backend API: http://localhost:3000
# Health Check: http://localhost:3000/health
```

### Development Setup

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Backend will be available at http://localhost:3000
# Database will be available at localhost:5432
```

### Standalone Database for Local Development

```bash
# Start only PostgreSQL
docker-compose -f docker-compose.postgres.yml up -d

# Run backend and frontend locally
npm run dev

# Make sure backend/.env has:
# DATABASE_URL=postgresql://postgres:prisma@localhost:5433/postgres?schema=public
```

## Dockerfiles

### Backend Dockerfiles

#### `backend/Dockerfile` - Production

Multi-stage build optimized for production:

- Base image: `node:22-alpine` (Node.js 22.x - required for Prisma 7.1.0+)
- Builds TypeScript to JavaScript
- Generates Prisma client
- Runs as non-root user
- Includes health checks
- Minimal production dependencies

#### `backend/Dockerfile.dev` - Development

Simple development setup:

- Base image: `node:22-alpine` (Node.js 22.x - required for Prisma 7.1.0+)
- Installs all dependencies (including dev)
- Mounts source code as volume
- Runs with hot-reload (`npm run dev`)
- Automatically runs migrations on startup

### Frontend Dockerfile

Located at `frontend/Dockerfile`:

- Multi-stage build
- Uses Nginx to serve static files
- Optimized for production

## Building Individual Images

### Backend (Production)

```bash
cd backend
docker build -t web-dev-backend .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e JWT_SECRET=your-secret \
  web-dev-backend
```

### Backend (Development)

```bash
cd backend
docker build -f Dockerfile.dev -t web-dev-backend-dev .
```

### Frontend

```bash
cd frontend
docker build --build-arg VITE_API_URL=http://localhost:3000 -t web-dev-frontend .
docker run -p 80:80 web-dev-frontend
```

## Docker Compose Services Details

### PostgreSQL Database

**Production & Development:**

- Image: `postgres:16-alpine`
- Data persisted in Docker volumes
- Health checks enabled
- Network: `prisma-network` or `web-dev-network`

**Standalone:**

- Port: `5433` (to avoid conflicts)
- Volume: `postgres_data`

### Backend Service

**Production:**

- Built from `backend/Dockerfile` (multi-stage)
- Automatically runs Prisma migrations on startup
- Health check endpoint: `/health`
- Runs as non-root user

**Development:**

- Built from `backend/Dockerfile.dev`
- Hot-reload enabled
- Volume mounting for live code changes
- Interactive terminal support

### Frontend Service

- Built from `frontend/Dockerfile`
- Uses Nginx to serve static files
- Health check endpoint: `/health`

## Health Checks

All services include health checks:

- **PostgreSQL**: Uses `pg_isready`
- **Backend**: HTTP GET to `/health`
- **Frontend**: HTTP GET to `/health`

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres
# or for dev setup
docker-compose -f docker-compose.dev.yml ps postgres_db

# View PostgreSQL logs
docker-compose logs postgres
# or for dev setup
docker-compose -f docker-compose.dev.yml logs postgres_db

# Connect to PostgreSQL directly (production)
docker-compose exec postgres psql -U postgres -d webdev

# Connect to PostgreSQL directly (development)
docker-compose -f docker-compose.dev.yml exec postgres_db psql -U postgres -d postgres

# Connect to standalone PostgreSQL
docker-compose -f docker-compose.postgres.yml exec postgres psql -U postgres -d postgres
```

### Port Conflicts

If you have a local PostgreSQL instance running on port `5432`:

- Use `docker-compose.postgres.yml` which uses port `5433`
- Or stop your local PostgreSQL instance
- Or change the port mapping in the compose file

### Backend Issues

```bash
# View backend logs
docker-compose logs backend
# or for dev setup
docker-compose -f docker-compose.dev.yml logs server

# Rebuild backend
docker-compose build backend
docker-compose up -d backend

# Rebuild dev backend
docker-compose -f docker-compose.dev.yml build server
docker-compose -f docker-compose.dev.yml up -d server
```

### Frontend Issues

```bash
# View frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### Reset Everything

```bash
# Stop all containers and remove volumes (production)
docker-compose down -v

# Stop all containers and remove volumes (development)
docker-compose -f docker-compose.dev.yml down -v

# Stop standalone PostgreSQL
docker-compose -f docker-compose.postgres.yml down -v

# Rebuild all images
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## Production Considerations

1. **Security**:

   - Use strong, unique passwords for PostgreSQL
   - Set a secure `JWT_SECRET` (use a random string generator)
   - Consider using Docker secrets for sensitive data
   - Enable HTTPS with a reverse proxy (e.g., Traefik, Nginx)
   - Run containers as non-root users (already implemented)

2. **Performance**:

   - Use Docker build cache for faster builds
   - Multi-stage builds are already implemented
   - Set appropriate resource limits in `docker-compose.yml`
   - Consider using connection pooling for the database

3. **Monitoring**:

   - Add logging aggregation (e.g., ELK stack, Loki)
   - Set up health check monitoring
   - Use container orchestration (Kubernetes, Docker Swarm) for production
   - Monitor resource usage

4. **Database**:

   - Use managed database services in production
   - Set up regular backups
   - Configure connection pooling
   - Use read replicas for scaling

5. **Volumes**:
   - Use named volumes for data persistence
   - Consider backup strategies for volumes
   - Use volume drivers for cloud storage in production

## CI/CD Integration

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automatically:

- Builds Docker images on push
- Pushes images to GitHub Container Registry
- Performs security scans

See the CI/CD section in the main README for more details.

## Migration Guide

### From Development to Production

1. Ensure all environment variables are set correctly
2. Build production images: `docker-compose build`
3. Run migrations: The backend automatically runs migrations on startup
4. Start services: `docker-compose up -d`
5. Verify health checks: Check all services are healthy

### Switching Between Setups

- **Production**: `docker-compose up -d`
- **Development**: `docker-compose -f docker-compose.dev.yml up -d`
- **Standalone DB**: `docker-compose -f docker-compose.postgres.yml up -d`

Make sure to stop one setup before starting another if they use the same ports.
