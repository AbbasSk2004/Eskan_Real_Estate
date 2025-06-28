#!/bin/bash

# Build script for Real Estate React Application

echo "🏗️  Building Real Estate React Application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    echo "📋 Loading environment variables..."
    export $(cat .env | xargs)
else
    echo "⚠️  No .env file found. Please create one with required environment variables."
    exit 1
fi

# Build the application
echo "🔨 Building Docker images..."
docker-compose build --no-cache

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "🚀 To start the application, run: docker-compose up -d"
    echo "🌐 Frontend will be available at: http://localhost:3000"
    echo "🔧 Backend API will be available at: http://localhost:3001"
else
    echo "❌ Build failed!"
    exit 1
fi
