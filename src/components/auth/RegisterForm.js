import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TermsAndConditions from '../legal/TermsAndConditions';
import { getFirebaseAuth } from '../../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const auth = getFirebaseAuth(); // Get auth instance

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsConditions: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (name === 'phone') {
      // Remove spaces and dashes
      newValue = newValue.replace(/[\s-]/g, '');
      // If starts with 0 and is 8 or 7 digits, convert to +961
      if (/^0\d{7,8}$/.test(newValue)) {
        newValue = '+961' + newValue.substring(1);
      }
      // If starts with 3 and is 7 digits, convert to +9613...
      if (/^3\d{6}$/.test(newValue)) {
        newValue = '+961' + newValue;
      }
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : newValue
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+961\d{7,8}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be in Lebanese format +961XXXXXXXXX';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.termsConditions) newErrors.termsConditions = 'You must agree to the terms and conditions';
    return newErrors;
  };

  const handleError = (error, setErrorFn) => {
    if (!error) return;
    if (error.response && error.response.data) {
      const apiErrors = {};
      if (error.response.data.email) apiErrors.email = error.response.data.email;
      if (error.response.data.phone) apiErrors.phone = error.response.data.phone;
      if (Object.keys(apiErrors).length > 0) {
        setErrorFn(apiErrors);
      } else {
        setErrorFn({ general: error.response.data.message || 'An error occurred. Please try again.' });
      }
    } else if (error.message) {
      setErrorFn({ general: error.message });
    } else {
      setErrorFn({ general: 'An unexpected error occurred. Please try again.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Instead of verifying phone here, navigate to PhoneVerification page
    navigate('/phone-verification', {
      state: {
        registrationData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          termsConditions: formData.termsConditions
        }
      }
    });
  };

  const handleSocialLogin = (provider) => {
    navigate('/phone-verification', {
      state: { provider }
    });
  };

  const setupRecaptcha = () => {
    console.log("Setting up recaptcha with auth:", auth);
    if (!window.recaptchaVerifier) {
      try {
        const recaptchaContainer = document.getElementById('recaptcha-container');
        if (!recaptchaContainer) {
          throw new Error('Recaptcha container not found');
        }

        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer, {
          size: 'invisible',
          callback: () => {
            console.log('Recaptcha verified');
          },
          'expired-callback': () => {
            console.log('Recaptcha expired');
            window.recaptchaVerifier = null;
          }
        });
        console.log("RecaptchaVerifier created successfully");
      } catch (error) {
        console.error("Error creating RecaptchaVerifier:", error);
      }
    }
    return window.recaptchaVerifier;
  };

  const sendCode = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    setIsVerifying(true);
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, formData.phone, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      setShowVerification(true);
    } catch (error) {
      handleError(error, (err) => setVerificationError(err.general || 'Failed to send verification code.'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await signInWithCredential(auth, credential);
      setIsPhoneVerified(true);
      setShowVerification(false);
      setVerificationError('');
    } catch (error) {
      handleError(error, (err) => setVerificationError(err.general || 'Verification failed. Please try again.'));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && (
        <div className="alert alert-danger" role="alert">
          {errors.general}
        </div>
      )}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="form-floating">
            <input 
              type="text" 
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <label htmlFor="firstName">First Name</label>
            {errors.firstName && (
              <div className="invalid-feedback">{errors.firstName}</div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating">
            <input 
              type="text" 
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            <label htmlFor="lastName">Last Name</label>
            {errors.lastName && (
              <div className="invalid-feedback">{errors.lastName}</div>
            )}
          </div>
        </div>
        <div className="col-md-12">
          <div className="form-floating">
            <input 
              type="email" 
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="email">Your Email</label>
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
        </div>
        <div className="col-md-12">
          <div className="form-floating">
            <input 
              type="tel" 
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              id="phone"
              name="phone"
              placeholder="+961XXXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              pattern="^\+961\d{7,8}$"
              required
              disabled={showVerification || isPhoneVerified}
            />
            <label htmlFor="phone">Phone Number</label>
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>
        </div>
        <div className="col-md-12">
          <div className="form-floating">
            <input 
              type="password" 
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
        </div>
        <div className="col-md-12">
          <div className="form-floating">
            <input 
              type="password" 
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>
        </div>
        <div className="col-12">
          <div className="form-check">
            <input 
              type="checkbox" 
              className={`form-check-input ${errors.termsConditions ? 'is-invalid' : ''}`}
              id="termsConditions"
              name="termsConditions"
              checked={formData.termsConditions}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="termsConditions">
              I agree to the <a
  href="#"
  className="text-primary"
  onClick={e => { e.preventDefault(); setShowTerms(true); }}
>
  Terms & Conditions
</a>
            </label>
            {errors.termsConditions && (
              <div className="invalid-feedback">{errors.termsConditions}</div>
            )}
          </div>
        </div>
        <div className="col-12">
          <button 
            className="btn btn-primary w-100 py-3" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Registering...
              </>
            ) : 'Register'}
          </button>
        </div>
        <div className="col-12 text-center mt-3">
          <p className="mb-2">Or Register With</p>
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
          <p className="mb-0">Already have an account? <Link to="/login" className="text-primary">Login here</Link></p>
        </div>
      </div>
      {showTerms && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Terms and Conditions</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowTerms(false)}
                ></button>
              </div>
              <div className="modal-body">
                <TermsAndConditions />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowTerms(false)}
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div id="recaptcha-container"></div>
    </form>
  );
};

export default RegisterForm;