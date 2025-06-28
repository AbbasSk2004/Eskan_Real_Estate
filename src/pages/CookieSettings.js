import React, { useState, useEffect } from 'react';
import { getCookieConsent, updateCookieConsent } from '../utils/cookieUtils';

const CookieSettings = () => {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const currentConsent = getCookieConsent();
    if (currentConsent) {
      setPreferences(currentConsent);
    }
  }, []);

  const handlePreferenceChange = (type) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSave = () => {
    updateCookieConsent(preferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white rounded shadow-sm p-5">
                <div className="text-center mb-5">
                  <i className="fa fa-cookie-bite fa-3x text-warning mb-3"></i>
                  <h2>Manage Cookie Preferences</h2>
                  <p className="text-muted">
                    Control which cookies we can use to improve your experience on our website.
                  </p>
                </div>

                {saved && (
                  <div className="alert alert-success" role="alert">
                    <i className="fa fa-check-circle me-2"></i>
                    Your cookie preferences have been saved successfully!
                  </div>
                )}

                {/* Cookie Categories */}
                <div className="cookie-preferences">
                  {/* Essential Cookies */}
                  <div className="cookie-category mb-4 p-4 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="mb-1">
                          <i className="fa fa-shield-alt text-success me-2"></i>
                          Essential Cookies
                        </h5>
                        <small className="text-muted">Always active - Required for basic functionality</small>
                      </div>
                      <div className="form-check form-switch">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={true}
                          disabled
                        />
                        <label className="form-check-label text-muted">Required</label>
                      </div>
                    </div>
                    <p className="text-muted mb-0">
                      These cookies are essential for the website to function properly. They enable 
                      core functionality such as security, network management, and accessibility.
                    </p>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="cookie-category mb-4 p-4 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="mb-1">
                          <i className="fa fa-chart-line text-info me-2"></i>
                          Analytics Cookies
                        </h5>
                        <small className="text-muted">Help us understand how you use our website</small>
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
                    <p className="text-muted mb-0">
                      These cookies help us understand how visitors interact with our website by 
                      collecting and reporting information anonymously.
                    </p>
                  </div>

                  {/* Functional Cookies */}
                  <div className="cookie-category mb-4 p-4 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="mb-1">
                          <i className="fa fa-cog text-primary me-2"></i>
                          Functional Cookies
                        </h5>
                        <small className="text-muted">Remember your preferences and settings</small>
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
                    <p className="text-muted mb-0">
                      These cookies enable the website to provide enhanced functionality and 
                      personalization. They may be set by us or by third party providers.
                    </p>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="cookie-category mb-4 p-4 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="mb-1">
                          <i className="fa fa-bullhorn text-warning me-2"></i>
                          Marketing Cookies
                        </h5>
                        <small className="text-muted">Personalized advertisements and content</small>
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
                    <p className="text-muted mb-0">
                      These cookies are used to deliver advertisements more relevant to you and 
                      your interests. They also help measure the effectiveness of advertising campaigns.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="text-center mt-5">
                  <div className="d-flex gap-3 justify-content-center">
                    <button 
                      className="btn btn-primary px-4"
                      onClick={handleSave}
                    >
                      <i className="fa fa-save me-2"></i>
                      Save Preferences
                    </button>
                    <a 
                      href="/legal/cookies" 
                      className="btn btn-outline-secondary px-4"
                    >
                      <i className="fa fa-info-circle me-2"></i>
                      Learn More
                    </a>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-5 pt-4 border-top">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-primary mb-3">
                        <i className="fa fa-clock me-2"></i>
                        When do cookies expire?
                      </h6>
                      <ul className="list-unstyled small text-muted">
                        <li>• Session cookies: When you close your browser</li>
                        <li>• Functional cookies: 30 days to 1 year</li>
                        <li>• Analytics cookies: 2 years</li>
                        <li>• Marketing cookies: 30 days to 2 years</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-primary mb-3">
                        <i className="fa fa-question-circle me-2"></i>
                        Need help?
                      </h6>
                      <p className="small text-muted mb-2">
                        If you have questions about our cookie usage, please contact us:
                      </p>
                      <p className="small text-muted mb-0">
                        <i className="fa fa-envelope me-1"></i> privacy@eskan-lebanon.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieSettings;