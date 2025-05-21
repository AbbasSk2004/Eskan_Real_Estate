import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
            <div className="about-img position-relative overflow-hidden p-5 pe-0">
              <img className="img-fluid w-100" src="/img/about.jpg" alt="" />
            </div>
          </div>
          <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
            <h1 className="mb-4">#1 Place To Find The Perfect Property</h1>
            <p className="mb-4">We are a leading real estate agency with years of experience in the market. Our mission is to help you find the perfect property that meets all your requirements and fits your budget.</p>
            <p><i className="fa fa-check text-primary me-3"></i>Expert real estate agents</p>
            <p><i className="fa fa-check text-primary me-3"></i>Wide range of properties</p>
            <p><i className="fa fa-check text-primary me-3"></i>Personalized service for each client</p>
            <Link to="/about" className="btn btn-primary py-3 px-5 mt-3">Read More</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;