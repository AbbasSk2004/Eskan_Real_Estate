import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const PhoneVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyPhone } = useAuth(); // Get verifyPhone from context
  const [step, setStep] = useState('phone'); // 'phone' or 'verification'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [provider, setProvider] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get the provider from URL query parameter
    const urlParams = new URLSearchParams(location.search);
    const providerParam = urlParams.get('provider');
    if (providerParam) {
      setProvider(providerParam);
    }
    // Optionally get phone from location.state if passed from register
    if (location.state?.phone) {
      setPhoneNumber(location.state.phone);
      setStep('verification');
    }
  }, [location]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!phoneNumber) {
      setError('Please enter a valid phone number');
      setIsSubmitting(false);
      return;
    }

    try {
      // Call backend to send verification code (implement this in your backend)
      await fetch('http://localhost:3001/api/auth/send-phone-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      });
      setStep('verification');
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!phoneNumber) {
      setError('Phone number is missing.');
      setIsSubmitting(false);
      return;
    }
    if (!verificationCode) {
      setError('Please enter the verification code');
      setIsSubmitting(false);
      return;
    }
    try {
      await verifyPhone(phoneNumber.trim(), verificationCode.trim());
      navigate('/'); // Redirect to home page
    } catch (err) {
      console.error('Verification error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProviderIcon = () => {
    switch(provider) {
      case 'facebook':
        return (
          <div className="bg-primary rounded-circle p-3 text-white">
            <i className="fab fa-facebook-f fa-2x"></i>
          </div>
        );
      case 'google':
        return (
          <div className="bg-danger rounded-circle p-3 text-white">
            <i className="fab fa-google fa-2x"></i>
          </div>
        );
      case 'twitter':
        return (
          <div className="bg-info rounded-circle p-3 text-white">
            <i className="fab fa-twitter fa-2x"></i>
          </div>
        );
      default:
        return (
          <div className="bg-success rounded-circle p-3 text-white">
            <i className="fas fa-envelope fa-2x"></i>
          </div>
        );
    }
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="wow fadeInUp" data-wow-delay="0.1s">
              <div className="text-center mb-5">
                <div id="socialIcon" className="d-inline-block mb-4">
                  {getProviderIcon()}
                </div>
                <h1 className="mb-3">Verify Your Account</h1>
                <p>We need to verify your phone number for security purposes.</p>
              </div>
              
              {step === 'phone' ? (
                <div id="phoneForm">
                  <form id="phoneNumberForm" onSubmit={handlePhoneSubmit}>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <div className="form-floating">
                          <input 
                            type="tel" 
                            className="form-control" 
                            id="phoneNumber" 
                            placeholder="Your Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                          />
                          <label htmlFor="phoneNumber">Your Phone Number</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100 py-3" type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Sending...' : 'Send Verification Code'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div id="verificationForm">
                  <form id="codeVerificationForm" onSubmit={handleVerificationSubmit}>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <div className="form-floating">
                          <input 
                            type="text" 
                            className="form-control" 
                            id="verificationCode" 
                            placeholder="Verification Code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                          />
                          <label htmlFor="verificationCode">Verification Code</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100 py-3" type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                      <div className="col-12 text-center">
                        <button 
                          type="button" 
                          className="btn btn-link" 
                          onClick={() => setStep('phone')}
                        >
                          Change phone number
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
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
    </div>
  );
};

export default PhoneVerification;
