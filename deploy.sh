#!/bin/bash

# Deployment script for Real Estate React Application

echo "🚀 Deploying Real Estate React Application..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Pull latest images (if using registry)
echo "📥 Pulling latest images..."
docker-compose pull

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo "🌐 Application is running at:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3001"
    echo "   Health:   http://localhost:3001/api/health"
else
    echo "❌ Deployment failed!"
    echo "📋 Container logs:"
    docker-compose logs
    exit 1
fi

# Show running containers
echo "📊 Running containers:"
docker-compose ps
