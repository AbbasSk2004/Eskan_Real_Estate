# Multi-stage build for React application
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production --silent
RUN cd backend && npm ci --only=production --silent

# Copy source code
COPY . .

# Build the React application
RUN npm run build

# Production stage with Nginx
FROM nginx:stable-alpine

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app to nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy backend files for API server (if running in same container)
COPY --from=build /app/backend /app/backend

# Install Node.js in the nginx container for running the backend
RUN apk add --no-cache nodejs npm

# Create a startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'cd /app/backend && node index.js &' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

# Expose ports
EXPOSE 80 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start both nginx and the backend API
CMD ["/start.sh"]

# Alternative: Separate containers approach
# If you prefer to run frontend and backend in separate containers,
# uncomment the following and comment out the above:

# FROM nginx:stable-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]