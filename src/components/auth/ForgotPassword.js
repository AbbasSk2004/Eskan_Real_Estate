import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import { useToast } from '../../hooks/useToast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Custom styles
  const formStyles = {
    maxWidth: '100%',
    width: '100%'
  };

  const inputStyles = {
    width: '100%',
    fontSize: '16px',
    padding: '12px 15px 12px 45px'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setSuccess(true);
        // Store email to pass to reset page
        sessionStorage.setItem('resetEmail', email);
      } else {
        setError(response.message || 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(
        error.response?.data?.message || 
        'Failed to send verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-10 col-sm-11">
              <div className="bg-light rounded p-4 p-md-5 text-center">
                <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fa fa-check fa-2x text-white"></i>
                </div>
                <h2 className="text-primary mb-3">Check Your Email</h2>
                <p className="text-muted mb-4">
                  We've sent a verification code to:
                  <br />
                  <strong>{email}</strong>
                </p>
                <p className="text-muted mb-4">
                  Enter the verification code on the next screen to reset your password.
                  If you don't see the email, check your spam folder.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/reset-password', { state: { email } })}
                  >
                    <i className="fa fa-arrow-right me-2"></i>
                    Continue to Reset Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-10 col-sm-11">
            <div className="bg-light rounded p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fa fa-key fa-2x text-white"></i>
                </div>
                <h2 className="text-primary">Forgot Password?</h2>
                <p className="text-muted">
                  No worries! Enter your email address and we'll send you a verification code to reset your password.
                </p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fa fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={formStyles}>
                <div className="form-group mb-4">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="input-with-icon">
                    <i className="fa fa-envelope"></i>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      disabled={loading}
                      style={inputStyles}
                    />
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary py-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending Verification Code...
                      </>
                    ) : (
                      'Send Verification Code'
                    )}
                  </button>
                </div>

                <div className="text-center mt-4">
                  <p>
                    Remember your password? <Link to="/login" className="text-primary">Login here</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;