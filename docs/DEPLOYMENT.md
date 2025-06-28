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
cd backend && npm run dev    # Backend (port 3001)
```

### Development URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

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
```json
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
```

### 2. Netlify (Frontend Only)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=build
```

**netlify.toml:**
```toml
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  REACT_APP_API_URL = "https://your-backend-url.com/api"
  REACT_APP_SUPABASE_URL = "your_supabase_url"
  REACT_APP_SUPABASE_ANON_KEY = "your_supabase_anon_key"
```

### 3. Heroku (Full Stack)

**Frontend (Create React App):**
```bash
# Create Heroku app for frontend
heroku create your-app-frontend

# Set environment variables
heroku config:set REACT_APP_API_URL=https://your-backend.herokuapp.com/api

# Deploy
git subtree push --prefix . heroku main
```

**Backend:**
```bash
# Create Heroku app for backend
heroku create your-app-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=your_supabase_url
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Deploy backend
git subtree push --prefix backend heroku main
```

**Procfile (for backend):**
```
web: node index.js
```

### 4. AWS EC2

```bash
# Connect to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone and setup application
git clone https://github.com/yourusername/real-estate-react.git
cd real-estate-react
npm install
cd backend && npm install

# Build frontend
npm run build

# Start backend with PM2
cd backend
pm2 start index.js --name "real-estate-backend"

# Install and configure Nginx
sudo apt update
sudo apt install nginx

# Copy nginx configuration
sudo cp ../nginx/nginx.conf /etc/nginx/sites-available/real-estate
sudo ln -s /etc/nginx/sites-available/real-estate /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Start services
sudo systemctl start nginx
sudo systemctl enable nginx
pm2 startup
pm2 save
```

### 5. DigitalOcean App Platform

**app.yaml:**
```yaml
name: real-estate-app
services:
- name: frontend
  source_dir: /
  github:
    repo: yourusername/real-estate-react
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: REACT_APP_API_URL
    value: ${backend.PUBLIC_URL}/api
  - key: REACT_APP_SUPABASE_URL
    value: your_supabase_url
  routes:
  - path: /
- name: backend
  source_dir: /backend
  github:
    repo: yourusername/real-estate-react
    branch: main
  run_command: node index.js
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: SUPABASE_URL
    value: your_supabase_url
  - key: SUPABASE_SERVICE_ROLE_KEY
    value: your_service_role_key
  routes:
  - path: /api
```

## Database Setup

### Supabase Configuration

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and API keys

2. **Database Schema:**
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2),
  property_type TEXT,
  listing_type TEXT,
  area DECIMAL(10,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  location TEXT,
  city TEXT,
  governorate TEXT,
  images TEXT[],
  features JSONB,
  details JSONB,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);
```

3. **Row Level Security Policies:**
```sql
-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Anyone can view active properties" ON properties FOR SELECT USING (status = 'active');
CREATE POLICY "Users can insert own properties" ON properties FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own properties" ON properties FOR UPDATE USING (auth.uid() = profile_id);
```

## SSL Configuration

### 1. Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Custom SSL Certificate

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Your location blocks here
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Nginx Configuration

Create `nginx/nginx.conf`:

````nginx
upstream backend {
    server backend:3001;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/certificate.crt;
    ssl_certificate_key /etc/ssl/certs/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    
    # Frontend (React app)
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Handle client-side routing
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
                # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
        add_header Access-Control-Expose-Headers "Content-Length,Content-Range" always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type "text/plain; charset=utf-8";
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
    }
    
    # Security - block access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(env|log|conf)$ {
        deny all;
    }
}
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart real-estate-backend

# Check status
pm2 status
# Check application health
curl https://yourdomain.com/health
curl https://yourdomain.com/api/health

# Check with response time
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com/api/health
