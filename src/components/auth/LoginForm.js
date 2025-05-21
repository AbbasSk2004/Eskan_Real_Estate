import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
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
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/'); // Redirect to home or dashboard
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
