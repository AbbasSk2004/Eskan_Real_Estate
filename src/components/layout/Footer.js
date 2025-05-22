import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { endpoints } from '../../services/api'; // Add this import
import { useAuth } from '../../context/AuthContext'; // Import your auth context

const Footer = () => {
  const thanksRef = useRef(null);
  const { isAuthenticated } = useAuth();

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.testimonialText.value;
    const rating = parseInt(e.target.testimonialRating.value, 10);

    if (!text || !rating) {
      alert('Please provide both testimonial text and a rating.');
      return;
    }

    try {
      await endpoints.addTestimonial({ text, rating });
      if (thanksRef.current) {
        thanksRef.current.classList.remove('d-none');
        setTimeout(() => {
          thanksRef.current.classList.add('d-none');
          e.target.reset();
        }, 2000);
      }
    } catch (err) {
      // Show detailed error from backend if available
      if (err.response && err.response.status === 401) {
        alert('Your session has expired. Please log in again to submit your testimonial.');
      } else if (err.response && err.response.data && err.response.data.message) {
        alert('Failed to submit testimonial: ' + err.response.data.message);
      } else {
        alert('Failed to submit testimonial. Please try again.');
      }
    }
  };

  return (
    <footer
      className="container-fluid bg-dark text-white-50 footer pt-5 mt-5 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div className="container py-5">
        <div className="row g-5 d-flex">
          <div className="col-lg-3 col-md-6 d-flex flex-column flex-grow-1">
            <h5 className="text-white mb-4">Get In Touch</h5>
            <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>Achrafieh, Charles Malek Avenue, Beirut, Lebanon</p>
            <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+961 1 234 567</p>
            <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@eskan-lebanon.com</p>
            <div className="d-flex pt-2">
              <a className="btn btn-outline-light btn-social" href="/" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a className="btn btn-outline-light btn-social" href="/" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a className="btn btn-outline-light btn-social" href="/" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
              <a className="btn btn-outline-light btn-social" href="/" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 d-flex flex-column flex-grow-1">
            <h5 className="text-white mb-4">Quick Links</h5>
            <Link to="/about" className="btn btn-link text-white-50">About Us</Link>
            <Link to="/contact" className="btn btn-link text-white-50">Contact Us</Link>
            <Link to="/properties" className="btn btn-link text-white-50">Our Properties</Link>
            <a className="btn btn-link text-white-50" href="/">Privacy Policy</a>
            <a className="btn btn-link text-white-50" href="/">Terms & Condition</a>
          </div>
          <div className="col-lg-3 col-md-6 d-flex flex-column flex-grow-1">
            <h5 className="text-white mb-4">Rate Us</h5>
            {isAuthenticated() ? (
              <form id="testimonialForm" className="rating-form-bg p-3 rounded" onSubmit={handleTestimonialSubmit}>
                <div className="mb-2">
                  <textarea className="form-control" id="testimonialText" rows="2" placeholder="Your thoughts..." required></textarea>
                </div>
                <div className="mb-2">
                  <select className="form-select" id="testimonialRating" required>
                    <option value="">Rating</option>
                    <option value="5">★★★★★</option>
                    <option value="4">★★★★☆</option>
                    <option value="3">★★★☆☆</option>
                    <option value="2">★★☆☆☆</option>
                    <option value="1">★☆☆☆☆</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Submit</button>
                <div ref={thanksRef} id="testimonialThanks" className="alert alert-success mt-2 d-none" role="alert">
                  Thank you for your feedback!
                </div>
              </form>
            ) : (
              <div className="alert alert-info">Please log in to submit a testimonial.</div>
            )}
          </div>
          <div className="col-lg-3 col-md-6 d-flex flex-column flex-grow-1 align-items-md-center align-items-lg-start">
            <h5 className="text-white mb-4">Contact Hours</h5>
            <p className="mb-2"><i className="fa fa-clock me-3"></i>Mon - Fri: 9am - 6pm</p>
            <p className="mb-2"><i className="fa fa-clock me-3"></i>Sat: 10am - 2pm</p>
            <p className="mb-2"><i className="fa fa-clock me-3"></i>Sun: Closed</p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <a className="border-bottom" href="#">Eskan Lebanon</a>, All Right Reserved.

            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="footer-menu">
                <a href="/">Home</a>
                <a href="#">Cookies</a>
                <a href="#">Help</a>
                <a href="#">FAQs</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;