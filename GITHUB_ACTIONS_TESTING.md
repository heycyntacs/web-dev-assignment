# GitHub Actions Workflow Testing Guide

This guide shows you how to test your CI/CD pipeline locally and on GitHub.

## Methods to Test GitHub Actions

### 1. Manual Trigger (Easiest) ⭐

The workflow now supports `workflow_dispatch`, allowing you to trigger it manually:

1. Go to your GitHub repository
2. Click on **Actions** tab
3. Select **CI/CD Pipeline** from the workflow list
4. Click **Run workflow** button (top right)
5. Select the branch (e.g., `main` or `develop`)
6. Click **Run workflow**

This will trigger the entire pipeline without needing to push code.

### 2. Test via Pull Request

Create a test branch and open a PR:

```bash
# Create a test branch
git checkout -b test/ci-cd-workflow

# Make a small change (or just add a comment)
echo "# Test CI/CD" >> README.md

# Commit and push
git add README.md
git commit -m "test: trigger CI/CD workflow"
git push origin test/ci-cd-workflow
```

Then create a Pull Request to `main` or `develop`. The workflow will run automatically.

### 3. Test via Push to Branch

Push directly to `main` or `develop`:

```bash
# Make a small change
echo "# Test" >> README.md
git add README.md
git commit -m "test: trigger CI/CD"
git push origin main
```

**Note:** Only works if you have push access to `main`/`develop`.

### 4. Local Testing with `act` (Advanced)

Test workflows locally using [act](https://github.com/nektos/act):

#### Installation

```bash
# macOS
brew install act

# Or download from: https://github.com/nektos/act/releases
```

#### Basic Usage

```bash
# List available workflows
act -l

# Run a specific job
act -j lint-and-test

# Run all jobs (dry-run, won't push images)
act

# Run with specific event
act push

# Run with secrets (if needed)
act --secret GITHUB_TOKEN=$GITHUB_TOKEN
```

#### Limitations

- Docker builds work but image pushing to GHCR won't work locally
- Some GitHub Actions may not work perfectly locally
- Use this for quick syntax/step validation

### 5. Test Individual Steps Locally

You can test each workflow step manually:

#### Test Lint and Type Check

```bash
# Install dependencies
npm install
cd frontend && npm ci && cd ..
cd backend && npm ci && cd ..

# Run lint
cd frontend && npm run lint

# Type check
cd frontend && npx tsc --noEmit
cd ../backend && npx tsc --noEmit
```

#### Test Docker Builds

```bash
# Build backend
cd backend
docker build -t test-backend .

# Build frontend
cd ../frontend
docker build -t test-frontend .

# Test with docker-compose
cd ..
docker-compose build
docker-compose up -d
npm run docker:health
docker-compose down
```

## Workflow Jobs Overview

Your CI/CD pipeline has 5 jobs:

1. **lint-and-test** - Lints code and runs type checks
2. **build-backend** - Builds and pushes backend Docker image
3. **build-frontend** - Builds and pushes frontend Docker image
4. **docker-compose-test** - Tests full stack with docker-compose
5. **security-scan** - Scans images for vulnerabilities (only on push, not PRs)

## Testing Checklist

### ✅ Before Pushing

- [ ] Code lints without errors
- [ ] TypeScript compiles without errors
- [ ] Docker images build locally
- [ ] Docker Compose works locally

### ✅ After Workflow Runs

- [ ] All jobs complete successfully (green checkmarks)
- [ ] No failed steps
- [ ] Docker images are pushed to GHCR (check Packages tab)
- [ ] Security scan completes (check Security tab)

## Monitoring Workflow Runs

### View Workflow Status

1. Go to **Actions** tab in GitHub
2. Click on a workflow run to see details
3. Click on a job to see individual steps
4. Click on a step to see logs

### View Logs

- Each step shows output in real-time
- Failed steps show error messages
- Use "Show timestamps" to see execution time

### Debugging Failed Workflows

1. **Check the failed step:**
   - Click on the red X
   - Read the error message
   - Check the logs

2. **Common Issues:**

   **Docker build fails:**
   ```bash
   # Test locally first
   docker-compose build
   ```

   **Type check fails:**
   ```bash
   # Run locally
   cd backend && npx tsc --noEmit
   cd ../frontend && npx tsc --noEmit
   ```

   **Permission errors (GHCR):**
   - Ensure `GITHUB_TOKEN` has write permissions
   - Check repository settings → Actions → General
   - Enable "Read and write permissions" for GITHUB_TOKEN

3. **Re-run failed jobs:**
   - Click "Re-run all jobs" or "Re-run failed jobs"

## Workflow Status Badge

Add a status badge to your README:

```markdown
![CI/CD](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI%2FCD%20Pipeline/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual values.

## Testing Specific Scenarios

### Test Only Lint Job

Create a workflow file for quick tests:

```yaml
# .github/workflows/test-lint.yml
name: Quick Lint Test
on: [workflow_dispatch, push]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: cd frontend && npm ci && npm run lint
      - run: cd backend && npm ci && npx tsc --noEmit
```

### Test Docker Build Only

```bash
# Test backend build
cd backend
docker build -t test-backend:local .

# Test frontend build
cd ../frontend
docker build -t test-frontend:local .

# Run locally
docker run -p 3000:3000 test-backend:local
docker run -p 80:80 test-frontend:local
```

## Best Practices

1. **Test locally first** - Don't rely on CI to catch errors
2. **Use feature branches** - Test workflows via PRs before merging
3. **Check workflow runs regularly** - Monitor for failures
4. **Keep workflows fast** - Use caching where possible
5. **Document failures** - Add comments in code if workflow needs special handling

## Quick Test Commands

```bash
# Test everything locally (simulates CI)
npm run docker:test

# Test linting
cd frontend && npm run lint
cd ../backend && npx tsc --noEmit

# Test Docker builds
docker-compose build --no-cache

# Test full stack
docker-compose up -d && sleep 10 && npm run docker:health
```

## Troubleshooting

### Workflow doesn't trigger

- Check branch name matches `main` or `develop`
- Verify `.github/workflows/ci-cd.yml` exists
- Check YAML syntax is valid

### Images not pushed to GHCR

- Only pushes on `push` events, not `pull_request`
- Check GITHUB_TOKEN permissions
- Verify registry name is correct

### Workflow times out

- Check for infinite loops in code
- Increase timeout if needed (add `timeout-minutes: 30` to job)

### Docker build fails in CI but works locally

- Check Dockerfile paths are correct
- Verify all files are committed
- Check `.dockerignore` isn't excluding needed files

## Next Steps

1. **First test:** Use `workflow_dispatch` to manually trigger
2. **Regular testing:** Create PRs to test workflow
3. **Monitor:** Check Actions tab regularly
4. **Optimize:** Adjust workflow based on results

