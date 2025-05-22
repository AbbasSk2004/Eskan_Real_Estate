import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Use AuthContext login, which updates context and storage
      const user = await login(formData.email, formData.password, formData.rememberMe);

      // Check if user is admin
      if (user.role === 'admin') {
        navigate('/admin-panel');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        // Handle specific error responses from the server
        if (err.response.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Login failed. Please try again.');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Redirect to backend OAuth endpoint
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
            <div className="about-img position-relative overflow-hidden p-5 pe-0">
              <img className="img-fluid w-100" src="img/about.jpg" alt="" />
            </div>
          </div>
          <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
            <div className="bg-light rounded p-3">
              <div className="bg-white rounded p-4" style={{ border: '1px dashed rgba(0, 185, 142, .3)' }}>
                <h3 className="mb-4">Sign In to Your Account</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form id="loginForm" onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-12">
                      <div className="form-floating">
                        <input 
                          type="email" 
                          className="form-control" 
                          id="email" 
                          name="email"
                          placeholder="Your Email" 
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-floating">
                        <input 
                          type="password" 
                          className="form-control" 
                          id="password" 
                          name="password"
                          placeholder="Your Password" 
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="password">Your Password</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex justify-content-between">
                        <div className="form-check">
                          <input 
                            type="checkbox" 
                            className="form-check-input" 
                            id="rememberMe" 
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                        </div>
                        <Link to="/forgot-password" className="text-primary">Forgot Password?</Link>
                      </div>
                    </div>
                    <div className="col-12">
                      <button 
                        className="btn btn-primary w-100 py-3" 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                      </button>
                    </div>
                    <div className="col-12 text-center mt-3">
                      <p className="mb-2">Or Sign In With</p>
                      <div className="d-flex justify-content-center">
                        <button 
                          type="button" 
                          className="btn btn-outline-primary me-2" 
                          onClick={() => handleSocialLogin('facebook')}
                        >
                          <i className="fab fa-facebook-f"></i> Facebook
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-danger me-2" 
                          onClick={() => handleSocialLogin('google')}
                        >
                          <i className="fab fa-google"></i> Google
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-info" 
                          onClick={() => handleSocialLogin('twitter')}
                        >
                          <i className="fab fa-twitter"></i> Twitter
                        </button>
                      </div>
                    </div>
                    <div className="col-12 text-center mt-3">
                      <p className="mb-0">Don't have an account? <Link to="/register" className="text-primary">Register here</Link></p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
