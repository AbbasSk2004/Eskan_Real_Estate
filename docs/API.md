# API Documentation

This document describes the REST API endpoints for the Real Estate React application.

## Base URL

```
Development: http://localhost:5000/api
Production: https://yourdomain.com/api
```

## Authentication

The API uses JWT tokens provided by Supabase for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "message": string,
  "data": object | array,
  "errors": array (optional)
}
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "jwt-token"
  }
}
```

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### POST /auth/verify-phone
Verify phone number with SMS code.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "code": "123456"
}
```

#### POST /auth/send-phone-code
Send SMS verification code.

**Request Body:**
```json
{
  "phone": "+1234567890"
}
```

#### POST /auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "reset-token",
  "password": "newpassword123"
}
```

### Properties

#### GET /properties
Get all properties with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `status` (string): 'sale' | 'rent' | 'all'
- `propertyType` (string): Property type filter
- `city` (string): City filter
- `governorate` (string): Governorate filter
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `bedrooms` (number): Minimum bedrooms
- `bathrooms` (number): Minimum bathrooms
- `featured` (boolean): Featured properties only
- `keyword` (string): Search keyword

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "uuid",
        "title": "Beautiful Apartment",
        "description": "...",
        "price": 250000,
        "property_type": "Apartment",
        "listing_type": "sale",
        "area": 120,
        "bedrooms": 2,
        "bathrooms": 2,
        "location": "Beirut, Lebanon",
        "images": ["url1", "url2"],
        "featured": false,
        "created_at": "2023-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### GET /properties/:id
Get a single property by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Beautiful Apartment",
    "description": "...",
    "price": 250000,
    "property_type": "Apartment",
    "listing_type": "sale",
    "area": 120,
    "bedrooms": 2,
    "bathrooms": 2,
    "location": "Beirut, Lebanon",
    "images": ["url1", "url2"],
    "features": ["airConditioning", "parking"],
    "details": {
      "floor": 3,
      "yearBuilt": 2020
    },
    "owner": {
      "id": "uuid",
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com"
    },
    "views_count": 150,
    "created_at": "2023-01-01T00:00:00Z"
  }
}
```

#### POST /properties
Create a new property listing. (Requires authentication)

**Request Body (multipart/form-data):**
```json
{
  "title": "Beautiful Apartment",
  "description": "...",
  "price": 250000,
  "property_type": "Apartment",
  "listing_type": "sale",
  "area": 120,
  "bedrooms": 2,
  "bathrooms": 2,
  "location": "Beirut, Lebanon",
  "city": "Beirut",
  "governorate": "Beirut",
  "features": ["airConditioning", "parking"],
  "details": {
    "floor": 3,
    "yearBuilt": 2020
  }
}
```
**Files:** `images[]` (multiple image files)

#### PUT /properties/:id
Update a property listing. (Requires authentication and ownership)

#### DELETE /properties/:id
Delete a property listing. (Requires authentication and ownership)

### User Profile

#### GET /profile
Get current user profile. (Requires authentication)

#### PUT /profile
Update user profile. (Requires authentication)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Real estate agent with 5 years experience",
  "company": "ABC Real Estate",
  "website": "https://example.com"
}
```

#### POST /profile/avatar
Upload profile avatar. (Requires authentication)

**Request Body (multipart/form-data):**
- `avatar` (image file)

### Favorites

#### GET /favorites
Get user's favorite properties. (Requires authentication)

#### POST /favorites
Add property to favorites. (Requires authentication)

**Request Body:**
```json
{
  "propertyId": "uuid"
}
```

#### DELETE /favorites/:propertyId
Remove property from favorites. (Requires authentication)

### Contact & Inquiries

#### POST /contact/inquiry
Submit a contact inquiry.

**Request Body:**
```json
{
  "propertyId": "uuid",
  "senderName": "John Doe",
  "senderEmail": "john@example.com",
  "senderPhone": "+1234567890",
  "subject": "Inquiry about property",
  "message": "I'm interested in this property...",
  "inquiryType": "general"
}
```

#### GET /contact/inquiries
Get user's inquiries. (Requires authentication)

### Analytics

#### GET /analytics/dashboard
Get user dashboard analytics. (Requires authentication)

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "propertiesCount": 5,
      "totalViews": 1250,
      "favoritesCount": 8,
      "inquiriesCount": 12
    },
    "recentActivity": [
      {
        "type": "view",
        "property": "Property Title",
        "timestamp": "2023-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Search

#### GET /search/suggestions
Get search suggestions.

**Query Parameters:**
- `q` (string): Search query

#### POST /search/save
Save search criteria. (Requires authentication)

**Request Body:**
```json
{
  "name": "My Search",
  "criteria": {
    "propertyType": "Apartment",
    "city": "Beirut",
    "minPrice": 100000,
    "maxPrice": 300000
  },
  "alertsEnabled": true
}
```

## Error Codes

- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Authentication required
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource not found
- `422` - Unprocessable Entity: Validation errors
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: Server error

## Rate Limiting

API requests are limited to:
- 100 requests per 15 minutes for authenticated users
- 50 requests per 15 minutes for unauthenticated users

## File Upload

### Image Upload Guidelines

- **Supported formats:** JPEG, PNG, GIF, WebP
- **Maximum file size:** 10MB per file
- **Maximum files per property:** 10 images
- **Recommended dimensions:** 1200x800px or higher
- **Image optimization:** Images are automatically optimized and resized

### Upload Process

1. Images are uploaded to Supabase Storage
2. Multiple sizes are generated (thumbnail, medium, large)
3. Public URLs are returned for each size
4. Original images are preserved

## Webhooks

### Property Events

The API can send webhooks for property-related events:

- `property.created`
- `property.updated`
- `property.deleted`
- `property.viewed`

### Webhook Payload

```json
{
  "event": "property.created",
  "timestamp": "2023-01-01T00:00:00Z",
  "data": {
    "property": {
      "id": "uuid",
      "title": "Property Title",
      "owner_id": "uuid"
    }
  }
}
```

## SDK and Libraries

### JavaScript/Node.js

```javascript
import { endpoints } from './src/services/api.js';

// Get properties
const properties = await endpoints.getProperties({
  page: 1,
  limit: 12,
  status: 'sale'
});

// Create property
const newProperty = await endpoints.addProperty(formData);
```

### cURL Examples

```bash
# Get properties
curl -X GET "http://localhost:5000/api/properties?status=sale&page=1"

# Create property (with authentication)
curl -X POST "http://localhost:5000/api/properties" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Property","price":250000,...}'
```

## Testing

Use the provided Postman collection or test with curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get properties
curl http://localhost:5000/api/properties
```

## Support

For API support, please:
1. Check this documentation
2. Review the [GitHub issues](https://github.com/yourusername/real-estate-react/issues)
3. Contact support at api-support@yourdomain.com
```

```markdown:docs/DEPLOYMENT.md
# Deployment Guide

This guide covers various deployment options for the Real Estate React application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Production Build](#production-build)
5. [Docker Deployment](#docker-deployment)
6. [Cloud Deployment](#cloud-deployment)
7. [Database Setup](#database-setup)
8. [SSL Configuration](#ssl-configuration)
9. [Monitoring](#monitoring)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 16+ and npm 8+
- Docker and Docker Compose (for containerized deployment)
- Supabase account and project
- Domain name (for production)
- SSL certificate (for HTTPS)

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/real-estate-react.git
cd real-estate-react
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Variables

Copy the example environment files and configure them:

```bash
# Frontend environment
cp .env.example .env

# Backend environment
cp backend/.env.example backend/.env
```

**Frontend (.env):**
```env
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

**Backend (backend/.env):**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
PORT=5000
NODE_ENV=production
```

## Local Development

### Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm start                    # Frontend (port 3000)
cd backend && npm run dev    # Backend (port 5000)
```

### Development URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Production Build

### 1. Build the Application

```bash
# Build frontend
npm run build

# Install backend production dependencies
cd backend
npm ci --only=production
```

### 2. Test Production Build

```bash
# Serve the built frontend
npx serve -s build -l 3000

# Start backend in production mode
cd backend
NODE_ENV=production node index.js
```

## Docker Deployment

### 1. Single Container (Frontend + Backend)

```bash
# Build the Docker image
docker build -t real-estate-app .

# Run the container
docker run -d \
  --name real-estate-app \
  -p 80:80 \
  -p 5000:5000 \
  --env-file .env \
  real-estate-app
```

### 2. Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    env_file:
      - backend/.env
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Cloud Deployment

### 1. Vercel (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**vercel.json:**
````json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "@api_url",
    "REACT_APP_SUPABASE_URL": "@supabase_url",
    "REACT_APP_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
