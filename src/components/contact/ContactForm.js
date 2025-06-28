import React, { useState } from 'react';
import api, { endpoints } from '../../services/api';

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferred_contact: 'email'
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await endpoints.contact.submit(formData);

      if (response.data.success) {
        alert(response.data.message);
        setFormData(prev => ({
          ...prev,
          message: '',
          name: '',
          email: '',
          phone: ''
        }));
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form bg-white p-4 rounded shadow-sm">
      <div className="row g-3">
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="form-control"
              style={{ height: '50px' }}
            />
            <label htmlFor="name">Your Name</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="form-control"
              style={{ height: '50px' }}
            />
            <label htmlFor="email">Your Email</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your Phone"
              className="form-control"
              style={{ height: '50px' }}
            />
            <label htmlFor="phone">Your Phone</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <select
              name="preferred_contact"
              id="preferred_contact"
              value={formData.preferred_contact}
              onChange={handleChange}
              className="form-select"
              required
              style={{ height: '50px' }}
            >
              <option value="email">Email</option>
              <option value="phone">Phone Call</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
            </select>
            <label htmlFor="preferred_contact">Preferred Contact Method</label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-floating">
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              className="form-control"
              style={{ height: '120px' }}
            />
            <label htmlFor="message">Your Message</label>
          </div>
        </div>

        <div className="col-12">
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending...
              </>
            ) : 'Send Message'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;