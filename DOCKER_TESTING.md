# Docker Production Testing Guide

This guide shows you how to test your application in production mode using Docker.

## Quick Start

### 1. Build and Start Production Containers

```bash
# Build production images
npm run docker:build

# Start containers in detached mode
npm run docker:up
```

Or use the combined test command:

```bash
npm run docker:test
```

### 2. Verify Services Are Running

```bash
# Check container status
npm run docker:ps

# Or use Docker directly
docker-compose ps
```

### 3. Test the Services

**Backend API:**

```bash
# Test backend health
curl http://localhost:3000/

# Or open in browser
open http://localhost:3000/
```

**Frontend:**

```bash
# Test frontend
curl http://localhost:80/

# Or open in browser
open http://localhost:80/
```

**Automated Health Check:**

```bash
npm run docker:health
```

### 4. View Logs

```bash
# View all logs
npm run docker:logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f backend
```

### 5. Stop Services

```bash
# Stop containers
npm run docker:down

# Stop and remove volumes
npm run docker:clean
```

## Production Testing Checklist

### ✅ Build Verification

- [ ] Images build successfully without errors
- [ ] No security vulnerabilities in base images
- [ ] Image sizes are reasonable

### ✅ Container Health

- [ ] Backend container starts successfully
- [ ] Frontend container starts successfully
- [ ] Health checks pass
- [ ] Containers restart automatically on failure

### ✅ Service Functionality

- [ ] Backend API responds at `http://localhost:3000/`
- [ ] Frontend serves static files at `http://localhost:80/`
- [ ] Frontend can communicate with backend
- [ ] No errors in container logs

### ✅ Performance

- [ ] Services start within reasonable time (< 30s)
- [ ] Response times are acceptable
- [ ] Memory usage is within limits

### ✅ Security

- [ ] Containers run as non-root user
- [ ] Only necessary ports are exposed
- [ ] Environment variables are properly set
- [ ] No sensitive data in logs

## Manual Testing Steps

1. **Build the images:**

   ```bash
   docker-compose build --no-cache
   ```

2. **Start services:**

   ```bash
   docker-compose up -d
   ```

3. **Wait for services to be healthy:**

   ```bash
   # Wait 10-15 seconds for services to start
   sleep 10

   # Check health
   docker-compose ps
   ```

4. **Test backend:**

   ```bash
   curl -v http://localhost:3000/
   ```

5. **Test frontend:**

   ```bash
   curl -v http://localhost:80/
   ```

6. **Check logs for errors:**

   ```bash
   docker-compose logs --tail=50
   ```

7. **Test container restart:**
   ```bash
   docker-compose restart backend
   docker-compose ps  # Verify it restarted successfully
   ```

## Troubleshooting

### Containers won't start

```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up
```

### Port already in use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :80

# Change ports in docker-compose.yml
# Set BACKEND_PORT=3001 and FRONTEND_PORT=8080
```

### Health checks failing

```bash
# Check if services are actually running
docker-compose exec backend node -e "console.log('Backend OK')"
docker-compose exec frontend wget -q -O- http://localhost/

# Check health check configuration
docker inspect web-dev-backend | grep -A 10 Healthcheck
```

### View container resource usage

```bash
docker stats web-dev-backend web-dev-frontend
```

## Production Deployment

Once local testing passes:

1. **Push images to registry** (if using CI/CD):

   ```bash
   # Images are automatically built and pushed via GitHub Actions
   ```

2. **Deploy to production server:**

   ```bash
   # On production server
   docker-compose pull
   docker-compose up -d
   ```

3. **Monitor in production:**
   ```bash
   docker-compose logs -f
   docker-compose ps
   ```

## Environment Variables

For production, create a `.env` file in the backend directory:

```env
NODE_ENV=production
PORT=3000
# Add other environment variables as needed
```

Then uncomment the `env_file` section in `docker-compose.yml`.
