import React, { useState } from 'react';
import api from '../../services/api';
import TermsAndConditions from '../legal/TermsAndConditions';

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  specialty: '',
  experience: '',
  aboutMe: '',
  profilePhoto: null,
  cvResume: null,
  facebook: '',
  twitter: '',
  instagram: '',
  terms: false
};

const AgentApplicationModal = ({ show, onClose }) => {
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

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'phone' && value) {
        formData.append('phone', normalizeLebanesePhone(value));
      } else if (value !== null) {
        formData.append(key, value);
      }
    });

    try {
      await api.post('/agent-applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Your application has been submitted successfully!');
      setForm(initialFormState);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit application.');
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
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" name="fullName" value={form.fullName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
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
                  <label className="form-label">About Me</label>
                  <textarea className="form-control" name="aboutMe" rows="3" value={form.aboutMe} onChange={handleChange} required></textarea>
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