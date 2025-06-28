import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="bg-light rounded p-5 text-center">
                <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fa fa-check fa-2x text-white"></i>
                </div>
                <h2 className="text-primary mb-4">Password Reset Successful</h2>
                <p className="text-muted mb-4">
                  Your password has been successfully reset. You will be redirected to the login page shortly.
                </p>
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
          <div className="col-lg-6 col-md-8">
            <div className="bg-light rounded p-5">
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fa fa-lock fa-2x text-white"></i>
                </div>
                <h2 className="text-primary">Reset Password</h2>
                <p className="text-muted">
                  Please enter your new password below.
                </p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fa fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
export { ResetPassword as ResetPasswordForm };