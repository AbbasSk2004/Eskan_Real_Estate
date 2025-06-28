import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
    
    // Initialize analytics and other services here
    initializeServices(allAccepted);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(essentialOnly));
    setShowBanner(false);
    
    initializeServices(essentialOnly);
  };

  const handleSavePreferences = () => {
    const consentData = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setShowBanner(false);
    setShowPreferences(false);
    
    initializeServices(consentData);
  };

  const initializeServices = (consent) => {
    // Initialize services based on consent
    if (consent.analytics) {
      // Initialize Google Analytics
      console.log('Analytics enabled');
    }
    if (consent.marketing) {
      // Initialize marketing tools
      console.log('Marketing cookies enabled');
    }
    if (consent.functional) {
      // Initialize functional cookies
      console.log('Functional cookies enabled');
    }
  };

  const handlePreferenceChange = (type) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div 
        className="cookie-consent-banner position-fixed bottom-0 start-0 end-0 bg-dark text-white p-4 shadow-lg"
        style={{ zIndex: 1055 }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mb-3 mb-lg-0">
              <div className="d-flex align-items-start">
                <i className="fa fa-cookie-bite fa-2x text-warning me-3 mt-1"></i>
                <div>
                  <h6 className="text-white mb-2">We use cookies</h6>
                  <p className="mb-0 small">
                    We use cookies to enhance your browsing experience, serve personalized content, 
                    and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.{' '}
                    <Link to="/legal/cookies" className="text-warning">
                      Learn more about our Cookie Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="d-flex flex-column flex-lg-row gap-2">
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={() => setShowPreferences(true)}
                >
                  <i className="fa fa-cog me-1"></i>
                  Preferences
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={handleRejectAll}
                >
                  Reject All
                </button>
                <button 
                  className="btn btn-warning btn-sm"
                  onClick={handleAcceptAll}
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Preferences Modal */}
      {showPreferences && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fa fa-cookie-bite text-warning me-2"></i>
                  Cookie Preferences
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowPreferences(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-4">
                  Choose which cookies you want to accept. You can change these settings at any time.
                </p>

                {/* Essential Cookies */}
                <div className="cookie-category mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h6 className="mb-1">Essential Cookies</h6>
                      <small className="text-muted">Required for the website to function</small>
                    </div>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={true}
                        disabled
                      />
                      <label className="form-check-label text-muted">Always Active</label>
                    </div>
                  </div>
                  <p className="small text-muted">
                    These cookies are necessary for the website to function and cannot be switched off. 
                    They include authentication, security, and basic functionality.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="cookie-category mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h6 className="mb-1">Analytics Cookies</h6>
                      <small className="text-muted">Help us improve our website</small>
                    </div>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={preferences.analytics}
                        onChange={() => handlePreferenceChange('analytics')}
                      />
                    </div>
                  </div>
                  <p className="small text-muted">
                    These cookies help us understand how visitors interact with our website by 
                    collecting anonymous information about usage patterns.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="cookie-category mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h6 className="mb-1">Functional Cookies</h6>
                      <small className="text-muted">Remember your preferences</small>
                    </div>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={preferences.functional}
                        onChange={() => handlePreferenceChange('functional')}
                      />
                    </div>
                  </div>
                  <p className="small text-muted">
                    These cookies remember your preferences and settings to provide a more 
                    personalized experience on future visits.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="cookie-category mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h6 className="mb-1">Marketing Cookies</h6>
                      <small className="text-muted">Personalized advertisements</small>
                    </div>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={preferences.marketing}
                        onChange={() => handlePreferenceChange('marketing')}
                      />
                    </div>
                  </div>
                  <p className="small text-muted">
                    These cookies are used to deliver relevant advertisements and track the 
                    effectiveness of our marketing campaigns.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowPreferences(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSavePreferences}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;