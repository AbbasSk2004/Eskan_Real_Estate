# Real Estate React Application

A full-stack, modern real estate web application built with React for the frontend and Express.js with Supabase for the backend. The platform allows users to browse, search, and filter property listings, manage their accounts, and contact agents directly. It features a responsive design, image galleries, testimonials, agent profiles, and an admin panel for property management.


<!-- Optionally add a link or screenshot here -->
<!-- ![Demo Screenshot](public/img/demo.png) -->

## Features

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

## Technologies Used

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

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

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

## Project Structure

```
.gitignore
package.json
README.md
.vscode/
│   └── launch.json
backend/
│   ├── .env
│   ├── index.js
│   └── package.json
public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   ├── robots.txt
│   └── img/
│       ├── about.jpg
│       ├── call-to-action.jpg
│       ├── carousel-1.jpg
│       ├── carousel-2.jpg
│       ├── header.jpg
│       ├── icon-apartment.png
│       ├── icon-building.png
│       └── ...
src/
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── supabase.js
│   ├── assets/
│   │   ├── css/
│   │   ├── img/
│   │   ├── lib/
│   │   │   ├── owlcarousel/
│   │   │   │   ├── assets/
│   │   │   │   │   ├── owl.carousel.css
│   │   │   │   │   ├── owl.theme.green.min.css
│   │   │   │   │   └── ...
│   │   │   │   ├── owl.carousel.js
│   │   │   │   └── LICENSE
│   │   │   ├── waypoints/
│   │   │   │   ├── links.php
│   │   │   │   └── ...
│   │   │   └── wow/
│   │   │       └── wow.js
│   │   └── scss/
│   │       └── bootstrap/
│   │           ├── scss/
│   │           │   ├── _reboot.scss
│   │           │   ├── _type.scss
│   │           │   └── bootstrap.scss
│   │           └── bootstrap-reboot.scss
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.js
│   │   │   ├── RegisterForm.js
│   │   │   └── PhoneVerification.js
│   │   ├── common/
│   │   │   ├── BackToTop.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── Spinner.js
│   │   ├── home/
│   │   │   ├── AboutSection.js
│   │   │   ├── CallToAction.js
│   │   │   ├── CategorySection.js
│   │   │   ├── FeaturedProperties.js
│   │   │   ├── HeaderCarousel.js
│   │   │   ├── SearchForm.js
│   │   │   ├── TeamSection.js
│   │   │   └── Testimonials.js
│   │   └── layout/
│   │       ├── Footer.js
│   │       └── Navbar.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── About.js
│   │   ├── Contact.js
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── NotFound.js
│   │   ├── Properties.js
│   │   ├── PropertyDetail.js
│   │   └── Register.js
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.js
│   └── index.js
```

## API Integration

The application is designed to work with a RESTful API. By default, it connects to the backend Express.js server in the `backend/` directory, which uses Supabase for data storage and authentication. You can update or extend the API endpoints in [`src/services/api.js`](src/services/api.js).

## Deployment

To build the application for production:

```bash
npm run build
```

This will create a `build` directory with optimized production files that can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

### Docker Deployment

A `Dockerfile` and `nginx.conf` are provided for containerized deployment:

```bash
docker build -t real-estate-app .
docker run -p 80:80 real-estate-app
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from various real estate websites
- Bootstrap themes and templates
- Open source libraries and tools

## Step 19: Create a Dockerfile for containerization

```dockerfile:Dockerfile
# Build stage
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Step 20: Create nginx configuration for production

```nginx:nginx/nginx.conf
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        root /usr/share/nginx/html;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }
    
    # Error pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```
