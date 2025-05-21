import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="bg-light rounded p-3">
          <div className="bg-white rounded p-4" style={{ border: '1px dashed rgba(0, 185, 142, .3)' }}>
            <div className="row g-5 align-items-center">
              <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                <img className="img-fluid rounded w-100" src="/img/call-to-action.jpg" alt="" />
              </div>
              <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                <div className="mb-4">
                  <h1 className="mb-3">Contact With Our Certified Agent</h1>
                  <p>Get in touch with our expert real estate agents to find your dream property. We're here to help you every step of the way.</p>
                </div>
                <Link to="/contact" className="btn btn-primary py-3 px-4 me-2">Get Started</Link>
                <Link to="/about" className="btn btn-dark py-3 px-4">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;