import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authStorage from '../../utils/authStorage';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/profile/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      if (response.data?.success) {
        toast.success('Password changed successfully! You will be logged out for security reasons.');
        
        // Clear tokens immediately after successful password change
        authStorage.clearTokens();
        
        // Set a short timeout to allow the toast message to be seen
        setTimeout(async () => {
          // Logout the user
          try {
            await logout();
          } catch (logoutError) {
            console.error('Logout error after password change:', logoutError);
            // Force navigation to login even if logout API call fails
            navigate('/login');
          }
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to change password. Please try again.');
      
      // Handle specific errors
      if (error.response?.data?.field) {
        setErrors({
          ...errors,
          [error.response.data.field]: error.response.data.message
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-light rounded p-4 mb-4">
      <h4 className="mb-4">Change Password</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="currentPassword" className="form-label">Current Password</label>
          <input
            type="password"
            className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.currentPassword && (
            <div className="invalid-feedback">{errors.currentPassword}</div>
          )}
        </div>
        
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <input
            type="password"
            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.newPassword && (
            <div className="invalid-feedback">{errors.newPassword}</div>
          )}
          <small className="form-text text-muted">
            Password must be at least 8 characters long
          </small>
        </div>
        
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
          <input
            type="password"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          )}
        </div>
        
        <div className="d-flex justify-content-end">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
