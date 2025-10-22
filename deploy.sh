#!/bin/bash

# PageIZ Deployment Script for EC2

echo "PageIZ Deployment Script"
echo "========================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please copy .env.example to .env and configure it."
    exit 1
fi

# Build and start Docker containers
echo "Building Docker containers..."
docker-compose down
docker-compose up -d --build

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Run Prisma migrations
echo "Running database migrations..."
docker-compose exec -T app npx prisma migrate deploy

echo "Deployment complete!"
echo "Application is running on port 3000"
