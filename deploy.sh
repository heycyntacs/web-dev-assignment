#!/bin/bash

# Deployment script for web-dev-assignment
# This script handles the complete deployment process

set -e  # Exit on any error

echo "Starting deployment process..."



# Function to print colored output
print_success() {
  echo -e "${NC} $1"
}

print_error() {
  echo -e "${NC} $1"
}

print_info() {
  echo -e "${NC} $1"
}

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
  print_error "Node.js is not installed. Please install Node.js >= 18.0.0"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  print_error "npm is not installed. Please install npm >= 9.0.0"
  exit 1
fi

print_success "Node.js and npm are installed"

# Step 1: Install dependencies
print_info "Installing dependencies..."
if npm run install:all; then
  print_success "Dependencies installed"
else
  print_error "Failed to install dependencies"
  exit 1
fi

# Step 2: Run Prisma migrations
print_info "Running database migrations..."
cd backend
if npx prisma migrate deploy; then
  print_success "Database migrations completed"
else
  print_error "Failed to run database migrations"
  exit 1
fi
cd ..

# Step 3: Generate Prisma client
print_info "Generating Prisma client..."
cd backend
if npx prisma generate; then
  print_success "Prisma client generated"
else
  print_error "Failed to generate Prisma client"
  exit 1
fi
cd ..

# Step 4: Build frontend
print_info "Building frontend..."
if npm run build:frontend; then
  print_success "Frontend built successfully"
else
  print_error "Failed to build frontend"
  exit 1
fi

# Step 5: Build backend (TypeScript compilation)
print_info "Building backend..."
cd backend
if npx tsc; then
  print_success "Backend built successfully"
else
  print_error "Failed to build backend"
  exit 1
fi
cd ..

print_success "Deployment completed successfully!"
print_info "You can now start the application with: npm start"

