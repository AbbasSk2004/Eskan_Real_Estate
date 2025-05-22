import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Spinner from './components/common/Spinner';
import BackToTop from './components/common/BackToTop';
import ScrollToTop from './components/common/ScrollToTop';
import SideChat from './components/chat/SideChat';

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
import { AuthProvider, useAuth, AuthContext } from './context/AuthContext';

function AppContent() {
  const { currentUser, setUser } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.WOW) {
      new window.WOW().init();
    }

    const handleSessionExpired = () => {
      setUser(null);
      navigate('/login');
    };

    window.addEventListener('sessionExpired', handleSessionExpired);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, [navigate, setUser]);

  return (
    <div className="container-xxl bg-white p-0">
      <Spinner />
      {!chatOpen && (
        <Navbar onDirectMessagesClick={() => setChatOpen(true)} />
      )}
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
      <SideChat open={chatOpen} onClose={() => setChatOpen(false)} currentUser={currentUser} />
      <ToastContainer position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
