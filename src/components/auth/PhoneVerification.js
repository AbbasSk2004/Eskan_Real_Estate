import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFirebaseAuth } from '../../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

const PhoneVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const auth = getFirebaseAuth(); // Get auth instance

  // Get registration data from navigation state (if any)
  const registrationData = location.state?.registrationData || null;
  const [phoneNumber, setPhoneNumber] = useState(registrationData ? registrationData.phone : '');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'verification'
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reusable error handler
  const handleError = (error, setErrorFn) => {
    console.error('Full error:', error);
    
    if (error.code === 'auth/operation-not-allowed') {
      setErrorFn('Phone authentication is not enabled. Please contact support.');
      return;
    }
    
    if (error.code === 'auth/invalid-phone-number') {
      setErrorFn('Invalid phone number format. Please use format: +961XXXXXXXX');
      return;
    }
    
    if (error.response && error.response.data) {
      setErrorFn(error.response.data.message || 'An error occurred. Please try again.');
    } else if (error.message) {
      setErrorFn(error.message);
    } else {
      setErrorFn('An unexpected error occurred. Please try again.');
    }
  };

  // Only create RecaptchaVerifier if not already present
  const setupRecaptcha = () => {
    try {
      // Only create if not already created
      if (!window.recaptchaVerifier) {
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
      }
      return window.recaptchaVerifier;
    } catch (error) {
      console.error("Error setting up reCAPTCHA:", error);
      setError("Failed to initialize verification system. Please try again.");
      throw error;
    }
  };

  // Format phone number to Lebanese format
  const formatLebanesePhone = (value) => {
    // Remove all non-digit characters
    let digits = value.replace(/\D/g, '');
    
    // If starts with 0, remove it
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }
    
    // If starts with 961, remove it
    if (digits.startsWith('961')) {
      digits = digits.substring(3);
    }
    
    // Add +961 prefix
    return `+961${digits}`;
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const formattedPhone = formatLebanesePhone(phoneNumber);
    
    if (!/^\+961\d{7,8}$/.test(formattedPhone)) {
      setError('Phone number must be in Lebanese format +961XXXXXXXXX');
      setIsSubmitting(false);
      return;
    }

    try {
      const recaptchaVerifier = await setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhone,
        recaptchaVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      setStep('verification');
    } catch (err) {
      console.error("Phone verification error:", err);
      handleError(err, setError);
      // Reset reCAPTCHA if there was an error
      if (window.recaptchaVerifier) {
        try {
          await window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (clearErr) {
          console.error("Error clearing reCAPTCHA:", clearErr);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await signInWithCredential(auth, credential);
      // If registration data is present, complete registration
      if (registrationData) {
        try {
          await register(registrationData);
          setStep('done');
          setError('');
          setTimeout(() => navigate('/'), 1500);
        } catch (regErr) {
          handleError(regErr, setError);
        }
      } else {
        setStep('done');
        setError('');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("AUTH OBJECT:", auth);

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="wow fadeInUp" data-wow-delay="0.1s">
              <div className="text-center mb-5">
                <h1 className="mb-3">Verify Your Phone</h1>
                <p>We need to verify your phone number for security purposes.</p>
              </div>
              {step === 'phone' && (
                <form onSubmit={handlePhoneSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="tel"
                      className="form-control"
                      id="phoneNumber"
                      placeholder="+961XXXXXXXXX"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      required
                      disabled={!!registrationData || isSubmitting}
                    />
                    <label htmlFor="phoneNumber">Your Phone Number</label>
                  </div>
                  <button className="btn btn-primary w-100 py-3" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </form>
              )}
              {step === 'verification' && (
                <form onSubmit={handleVerificationSubmit} className="d-flex flex-column align-items-start mt-3">
                  <label htmlFor="verificationCode">Enter the code sent to your phone:</label>
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    required
                    className="form-control mb-2"
                    style={{ maxWidth: 250 }}
                    disabled={isSubmitting}
                  />
                  <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                    {isSubmitting ? 'Verifying...' : 'Verify'}
                  </button>
                </form>
              )}
              {step === 'done' && (
                <div className="alert alert-success mt-4">Phone verified! Redirecting...</div>
              )}
              {error && (
                <div className="alert alert-danger mt-4" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneVerification;