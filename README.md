# Real Estate React Application

[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-green)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-purple)](https://supabase.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

```bash
# Enable debug logging
DEBUG=eskan:* npm start

# Backend debug mode
NODE_ENV=development DEBUG=express:* npm run dev
```

## 🎉 Success Stories

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

- React.js
- React Router for navigation
- Context API for state management
- Axios for API requests
- Bootstrap 5 for styling
- jQuery for DOM manipulation
- Owl Carousel for sliders
- WOW.js for scroll animations
- Font Awesome and Bootstrap Icons for icons
- Supabase for backend and authentication
- Express.js for backend API

## 🏁 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Docker (optional, for containerization)
- Supabase account and project

### Environment Variables

#### Frontend (.env)
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:5000/api
```

#### Backend (backend/.env)
```
NODE_ENV=development
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/real-estate-react.git
    ```

2. Navigate to the project directory:
    ```bash
    cd real-estate-react
    ```

3. Install dependencies for both frontend and backend:
    ```bash
    npm install
    cd backend
    npm install
    cd ..
    ```

4. Set up environment variables for the backend:
    - Copy `.env.example` to `.env` in the `backend/` directory and fill in your Supabase credentials.

5. Start the backend server:
    ```bash
    cd backend
    node index.js
    ```

6. Start the frontend development server:
    ```bash
    npm start
    ```

7. Open your browser and visit `http://localhost:3000`

## 📁 Project Structure

```
├── backend/                # Express.js backend
│   ├── config/            # Configuration files
│   ├── database/          # Database schemas and migrations
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
├── public/                # Static files
├── src/                   # React frontend
│   ├── components/        # Reusable components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── utils/            # Utility functions
├── docs/                  # Documentation
└── nginx/                 # Nginx configuration
```

## 🧪 Testing

Run the test suites:

```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test
```

## 🐳 Docker Deployment

Build and run with Docker Compose:

```bash
docker-compose up --build
```

Or build and run individual containers:

```bash
# Build and run frontend
docker build -t real-estate-frontend .
docker run -p 80:80 real-estate-frontend

# Build and run backend
cd backend
docker build -t real-estate-backend .
docker run -p 5000:5000 real-estate-backend
```

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
- All the awesome [contributors](https://github.com/yourusername/real-estate-react/graphs/contributors)
