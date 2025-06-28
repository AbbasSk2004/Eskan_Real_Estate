import React, { useState } from 'react';
import api, { endpoints } from '../../services/api';
import TermsAndConditions from '../legal/TermsAndConditions';

const initialFormState = {
  specialty: '',
  phone: '',
  experience: '',
  aboutMe: '',
  profilePhoto: null,
  cvResume: null,
  facebook: '',
  twitter: '',
  instagram: '',
  terms: false
};

const AgentApplicationModal = ({ show, onClose, onApplicationSubmitted }) => {
  const [form, setForm] = useState(initialFormState);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  // Helper to normalize phone to Lebanese format
  function normalizeLebanesePhone(phone) {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('961')) {
      return `+${cleaned}`;
    }
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    return `+961${cleaned}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!form.specialty) {
      setError('Please select a specialty.');
      return;
    }
    if (!form.experience) {
      setError('Please select your years of experience.');
      return;
    }
    if (!form.aboutMe?.trim()) {
      setError('Please provide information about yourself.');
      return;
    }
    if (!form.terms) {
      setError('Please accept the terms and conditions.');
      return;
    }

    // Validate phone number: must be 8 digits after normalization (excluding +961)
    const cleaned = form.phone.replace(/\D/g, '');
    let localPart = cleaned;
    if (cleaned.startsWith('961')) {
      localPart = cleaned.slice(3);
    } else if (cleaned.startsWith('0')) {
      localPart = cleaned.slice(1);
    }
    if (localPart.length !== 8) {
      setError('Phone number must be 8 digits in Lebanese format (e.g., 70123456).');
      return;
    }

    // Validate file uploads
    if (!form.profilePhoto) {
      setError('Please upload a profile photo.');
      return;
    }
    if (!form.cvResume) {
      setError('Please upload your CV/Resume.');
      return;
    }

    // Validate file types
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedImageTypes.includes(form.profilePhoto.type)) {
      setError('Profile photo must be a JPG, PNG, or GIF file.');
      return;
    }
    if (!allowedDocTypes.includes(form.cvResume.type)) {
      setError('CV/Resume must be a PDF or Word document.');
      return;
    }

    const formData = new FormData();

    // Add required fields matching backend expectations
    formData.append('specialization', form.specialty);
    formData.append('experience', form.experience);
    formData.append('bio', form.aboutMe.trim());
    formData.append('phone', normalizeLebanesePhone(form.phone));
    formData.append('languages', 'English, Arabic');
    
    // Add social media links if provided
    if (form.facebook?.trim()) formData.append('facebook_url', form.facebook.trim());
    if (form.twitter?.trim()) formData.append('twitter_url', form.twitter.trim());
    if (form.instagram?.trim()) formData.append('instagram_url', form.instagram.trim());

    // Add files with names matching backend expectations
    formData.append('profilePhoto', form.profilePhoto);
    formData.append('cvResume', form.cvResume);

    try {
      console.log('Submitting application...');
      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }
      
      const response = await endpoints.agents.apply(formData);
      
      if (response.data?.success) {
        alert('Your application has been submitted successfully!');
        setForm(initialFormState);
        if (onApplicationSubmitted) {
          onApplicationSubmitted();
        }
        onClose();
      } else if (response.data?.message) {
        setError(response.data.message);
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Application error:', error);
      
      if (error.response?.status === 401) {
        setError('Please log in to submit your application.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || 'Failed to submit application. Please try again.');
      }
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1055, paddingTop: 80 }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" style={{ zIndex: 1060 }}>
          <div className="modal-content">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="modal-header">
                <h5 className="modal-title">Apply to Become an Agent</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Specialty</label>
                    <select className="form-select" name="specialty" value={form.specialty} onChange={handleChange} required>
                      <option value="">Select Specialty</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Luxury">Luxury Homes</option>
                      <option value="Investment">Investment Properties</option>
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Years of Experience</label>
                    <select className="form-select" name="experience" value={form.experience} onChange={handleChange} required>
                      <option value="">Select Experience</option>
                      <option value="1">0-2 Years</option>
                      <option value="2">3-5 Years</option>
                      <option value="3">5+ Years</option>
                      <option value="4">10+ Years</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">About Me <span className="text-danger">*</span></label>
                  <textarea 
                    className="form-control" 
                    name="aboutMe" 
                    rows="3" 
                    value={form.aboutMe} 
                    onChange={handleChange} 
                    required 
                    placeholder="Tell us about your experience and why you want to be an agent..."
                  ></textarea>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Profile Photo</label>
                    <input type="file" className="form-control" name="profilePhoto" accept="image/*" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">CV/Resume</label>
                    <input type="file" className="form-control" name="cvResume" accept=".pdf,.doc,.docx" onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Social Media Links</label>
                  <div className="input-group mb-2">
                    <span className="input-group-text"><i className="fab fa-facebook-f"></i></span>
                    <input type="url" className="form-control" name="facebook" placeholder="Facebook URL" value={form.facebook} onChange={handleChange} />
                  </div>
                  <div className="input-group mb-2">
                    <span className="input-group-text"><i className="fab fa-twitter"></i></span>
                    <input type="url" className="form-control" name="twitter" placeholder="Twitter URL" value={form.twitter} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fab fa-instagram"></i></span>
                    <input type="url" className="form-control" name="instagram" placeholder="Instagram URL" value={form.instagram} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" name="terms" checked={form.terms} onChange={handleChange} required />
                  <label className="form-check-label">
                    I agree to the{' '}
                    <a
                      href="/"
                      className="text-primary"
                      onClick={e => {
                        e.preventDefault();
                        setShowTerms(true);
                      }}
                      role="button"
                      tabIndex="0"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                <button type="submit" className="btn btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
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
    </>
  );
};

export default AgentApplicationModal;