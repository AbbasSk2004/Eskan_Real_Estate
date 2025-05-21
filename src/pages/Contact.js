import React, { useState, useEffect } from 'react';
import { endpoints } from '../services/api'; // <-- Import endpoints

const initialState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false,
};

const Contact = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const WOW = window.WOW;
    if (WOW) {
      new WOW().init();
    }
  }, []);

  const phoneRegex = /^(\+961|0)([1-9][0-9]{6}|[3,7,8][0-9]{6})$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid Lebanese phone number';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';
    if (!formData.consent) newErrors.consent = 'Consent is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      await endpoints.sendContactMessage(formData); // <-- Use backend API
      setSubmitSuccess(true);
      setFormData(initialState);
    } catch (err) {
      setErrors({ general: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Header Start */}
      <div className="container-fluid header bg-white p-0">
        <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-6 p-5 mt-lg-5">
            <h1 className="display-5 animated fadeIn mb-4">Contact Us</h1>
            <nav aria-label="breadcrumb animated fadeIn">
              <ol className="breadcrumb text-uppercase">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item text-body active" aria-current="page">Contact</li>
              </ol>
            </nav>
          </div>
          <div className="col-md-6 animated fadeIn">
            <img className="img-fluid" src="/img/header.jpg" alt="" />
          </div>
        </div>
      </div>
      {/* Header End */}

      {/* Contact Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: 600 }}>
            <h1 className="mb-3">Get In Touch With Us</h1>
            <p>Looking for your dream property in Lebanon? Our expert team is here to guide you through the best real estate opportunities across the country.</p>
          </div>
          <div className="row g-4">
            <div className="col-12">
              <div className="row gy-4">
                <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay="0.1s">
                  <div className="bg-light rounded p-3">
                    <div className="d-flex align-items-center bg-white rounded p-3" style={{ border: '1px dashed rgba(0, 185, 142, .3)' }}>
                      <div className="icon me-3" style={{ width: 45, height: 45 }}>
                        <i className="fa fa-map-marker-alt text-primary"></i>
                      </div>
                      <span>Achrafieh, Charles Malek Avenue, Beirut, Lebanon</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay="0.3s">
                  <div className="bg-light rounded p-3">
                    <div className="d-flex align-items-center bg-white rounded p-3" style={{ border: '1px dashed rgba(0, 185, 142, .3)' }}>
                      <div className="icon me-3" style={{ width: 45, height: 45 }}>
                        <i className="fa fa-envelope-open text-primary"></i>
                      </div>
                      <span>info@realestate-lb.com</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay="0.5s">
                  <div className="bg-light rounded p-3">
                    <div className="d-flex align-items-center bg-white rounded p-3" style={{ border: '1px dashed rgba(0, 185, 142, .3)' }}>
                      <div className="icon me-3" style={{ width: 45, height: 45 }}>
                        <i className="fa fa-phone-alt text-primary"></i>
                      </div>
                      <span>+961 1 234 567<br />+961 70 123 456</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <iframe
                className="position-relative rounded w-100 h-100"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13251.151371750465!2d35.50662716977539!3d33.89746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f16d47611572f%3A0x1d64e4c4422b9657!2sAchrafieh%2C%20Beirut!5e0!3m2!1sen!2slb!4v1625661234567!5m2!1sen!2slb"
                frameBorder="0"
                style={{ minHeight: 400, border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
                title="Google Maps"
              ></iframe>
            </div>
            <div className="col-md-6">
              <div className="wow fadeInUp" data-wow-delay="0.5s">
                {submitSuccess && (
                  <div className="alert alert-success mb-4">
                    Thank you for your message! We will get back to you soon.<br />
                    <span dir="rtl">شكراً لرسالتك! سنتواصل معك قريباً</span>
                  </div>
                )}
                {errors.general && (
                  <div className="alert alert-danger mb-4">{errors.general}</div>
                )}
                <form className="bg-light rounded p-4" onSubmit={handleSubmit} noValidate>
                  <h3 className="mb-4">Contact Our Team</h3>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating mb-2">
                        <input
                          type="text"
                          className={`form-control${errors.name ? ' is-invalid' : ''}`}
                          id="name"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="name">Your Name</label>
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-2">
                        <input
                          type="email"
                          className={`form-control${errors.email ? ' is-invalid' : ''}`}
                          id="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="email">Your Email</label>
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-2">
                        <input
                          type="tel"
                          className={`form-control${errors.phone ? ' is-invalid' : ''}`}
                          id="phone"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="phone">Phone Number (Lebanese format)</label>
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-2">
                        <input
                          type="text"
                          className={`form-control${errors.subject ? ' is-invalid' : ''}`}
                          id="subject"
                          name="subject"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="subject">Subject</label>
                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-2">
                        <textarea
                          className={`form-control${errors.message ? ' is-invalid' : ''}`}
                          placeholder="Leave a message here"
                          id="message"
                          name="message"
                          style={{ height: '120px' }}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="message">Message</label>
                        {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check mb-2">
                        <input
                          className={`form-check-input${errors.consent ? ' is-invalid' : ''}`}
                          type="checkbox"
                          id="consent"
                          name="consent"
                          checked={formData.consent}
                          onChange={handleChange}
                          required
                        />
                        <label className="form-check-label" htmlFor="consent">
                          I consent to having this website store my submitted information
                        </label>
                        {errors.consent && <div className="invalid-feedback d-block">{errors.consent}</div>}
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-3" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact End */}
    </>
  );
};

export default Contact;
