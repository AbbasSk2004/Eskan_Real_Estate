import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth';
import { useToast } from '../../hooks/useToast';
import '../../assets/css/RegisterForm.css';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  useEffect(() => {
    // Get email from location state or session storage
    const emailFromState = location.state?.email;
    const emailFromSession = sessionStorage.getItem('resetEmail');
    
    if (emailFromState) {
      setEmail(emailFromState);
    } else if (emailFromSession) {
      setEmail(emailFromSession);
    } else {
      // No email provided, redirect to forgot password
      toast.error('Please start the password reset process from the beginning.');
      navigate('/forgot-password');
    }
  }, [location, navigate, toast]);

  const validateForm = () => {
    if (!otp) {
      setError('Verification code is required');
      return false;
    }
    
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit verification code');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.resetPassword(email, otp, password);
      
      if (response.success) {
        toast.success('Password has been reset successfully!');
        // Clear the stored email
        sessionStorage.removeItem('resetEmail');
        navigate('/login', { replace: true });
      } else {
        setError(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError(
        error.response?.data?.message || 
        'Failed to reset password. The verification code may have expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        toast.success('A new verification code has been sent to your email');
      } else {
        toast.error(response.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <div className="form-header text-center">
        <h2>Reset Your Password</h2>
        <p className="text-muted">Enter the verification code sent to {email}</p>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="fa fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="registration-form" style={formStyles}>
        <div className="form-group mb-4">
          <label htmlFor="otp">Verification Code *</label>
          <div className="input-with-icon">
            <i className="fa fa-key"></i>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              className={error && !otp ? 'error' : ''}
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              style={inputStyles}
            />
          </div>
          <div className="mt-1">
            <button 
              type="button" 
              className="btn btn-link p-0 text-primary"
              onClick={handleResendOtp}
              disabled={loading}
            >
              Didn't receive the code? Resend Code
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="password">New Password *</label>
              <div className="input-with-icon">
                <i className="fa fa-lock"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className={error && !password ? 'error' : ''}
                  style={inputStyles}
                />
                <i 
                  className={`toggle-password-icon fa fa-eye${showPassword ? '-slash' : ''}`}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                ></i>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password *</label>
              <div className="input-with-icon">
                <i className="fa fa-lock"></i>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className={error && password !== confirmPassword ? 'error' : ''}
                  style={inputStyles}
                />
                <i 
                  className={`toggle-password-icon fa fa-eye${showConfirmPassword ? '-slash' : ''}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                ></i>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </div>

        <div className="login-link text-center mt-3">
          <p>
            Remember your password? <Link to="/login" className="text-primary">Login here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm; 