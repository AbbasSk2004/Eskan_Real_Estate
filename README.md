# ESKAN Real Estate Platform

[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-green)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-purple)](https://supabase.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack, modern real estate web application built with React for the frontend and Express.js with Supabase for the backend. The platform allows users to browse, search, and filter property listings, manage their accounts, and contact agents directly. It features a responsive design, image galleries, testimonials, agent profiles, and an admin panel for property management.

## 🚀 Features

- Property listings with advanced search and filter functionality
- User authentication (login, register, social login)
- Phone number verification
- Responsive design for all devices
- Property details with image galleries
- Contact forms for property inquiries
- Interactive maps for property locations
- Testimonials carousel
- Featured properties section
- Agent profiles
- Admin panel for property and user management

## 🛠️ Technologies Used

- **Frontend**: React.js, React Router, Bootstrap 5, Context API
- **Backend**: Express.js, Supabase
- **Authentication**: JWT, Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Maps**: Google Maps API
- **Deployment**: Docker, Nginx
- **Other**: Axios, React Toastify, Font Awesome

## 🏁 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)
- Supabase account and project

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# API URL - Development
REACT_APP_API_URL=http://localhost:5000/api

# API URL - Production
# REACT_APP_API_URL=https://eskan-real-estate-backend.onrender.com/api

# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase Configuration (if using Firebase)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

For the backend, create a `.env` file in the `backend` directory:

```
NODE_ENV=development
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/AbbasSk2004/ESKAN_Real_Estate.git
    cd ESKAN_Real_Estate
    ```

2. Install dependencies for both frontend and backend:
    ```bash
    npm run install-all
    ```

3. Start the development servers:
    ```bash
    npm run dev
    ```

4. Open your browser and visit `http://localhost:3000`

## 📁 Project Structure

```
           # Utility functions
├── public/                # Static files
├── src/                   # React frontend
│   ├── components/        # Reusable components
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── nginx/                 # Nginx configuration
└── scripts/               # Utility scripts
```

## 🚢 Deployment

### Production Backend

The application is configured to use the production backend at:
```
https://eskan-real-estate-backend.onrender.com
```

For local development, the application uses `http://localhost:5000/api`. When deploying to production, you should use the production URL in your environment variables.

### Using Docker Compose (Recommended)

1. Create production environment files:
   - `.env.production` in the root directory
   - `backend/.env.production` for backend settings

2. Build and run with Docker Compose:
    ```bash
    docker-compose up --build -d
    ```

3. Access your application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

### Manual Deployment

1. Build the frontend:
    ```bash
    npm run build
    ```

2. Serve the frontend with Nginx or a similar web server

3. Start the backend server:
    ```bash
    cd backend
    NODE_ENV=production npm start
    ```

### Deploying to Netlify

1. Push your code to GitHub:
    ```bash
    git add .
    git commit -m "Prepare for Netlify deployment"
    git push origin main
    ```

2. Log in to Netlify (https://app.netlify.com/)

3. Click "Import from Git" and select your GitHub repository

4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`

5. Add the required environment variables in Netlify's deploy settings:
   - REACT_APP_API_URL 
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_ANON_KEY
   - REACT_APP_GOOGLE_MAPS_API_KEY
   - (Add any other required variables from your .env file)

6. Deploy! Netlify will automatically build and deploy your site

7. To enable React Router to work properly, Netlify will use the redirects configuration in the netlify.toml file that has been added to the project.

## ⚠️ Troubleshooting

Common issues and solutions:

1. **CORS errors**: Ensure your backend CORS configuration matches your frontend domain
2. **Authentication issues**: Verify Supabase credentials and JWT configuration
3. **Image upload fails**: Check Supabase storage bucket permissions
4. **Build fails**: Clear npm cache and node_modules, then reinstall

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from various real estate websites
- [Bootstrap](https://getbootstrap.com/) for the UI framework
- [Supabase](https://supabase.io/) for backend services
- [Express.js](https://expressjs.com/) for the API server
