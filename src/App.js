import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Spinner from './components/common/Spinner';
import BackToTop from './components/common/BackToTop';
import ScrollToTop from './components/common/ScrollToTop';

// Styles

import './assets/lib/animate/animate.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import PhoneVerification from './components/auth/PhoneVerification';
import NotFound from './pages/NotFound';
import AddProperty from './pages/AddProperty';
import PropertyAgent from './pages/PropertyAgent';

// Protected route
import ProtectedRoute from './components/common/ProtectedRoute';

// Context providers
import { AuthProvider } from './context/AuthContext';

function App() {
  useEffect(() => {
    if (window.WOW) {
      new window.WOW().init();
    }
  }, []);

  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="container-xxl bg-white p-0">
          <Spinner />
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/phone-verification" element={<PhoneVerification />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <div>Profile Page (To be implemented)</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <ProtectedRoute>
                  <div>Favorites Page (To be implemented)</div>
                </ProtectedRoute>
              } 
            />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/property-agent" element={<PropertyAgent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <BackToTop />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
