import React, { useEffect, useState } from 'react';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel';
import AgentCard from '../components/agent/AgentCard';
import { endpoints } from '../services/api';
import 'wow.js';
import 'animate.css';

const About = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Get featured agents and limit to 4
        const response = await endpoints.agents.getFeatured();
        if (response?.data?.success) {
          // Take only the first 4 agents
          const featuredAgents = response.data.data.filter(agent => 
            agent.approved && agent.status === 'approved' && agent.is_featured
          ).slice(0, 4);
          setAgents(featuredAgents);
        } else {
          throw new Error('Failed to fetch agents');
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
        setError('Failed to load agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    const WOW = window.WOW;
    new WOW({
      boxClass: 'wow',
      animateClass: 'animate__animated',
      offset: 0,
      mobile: true,
      live: true
    }).init();
  }, []);

  return (
    <>
      {/* Header Start */}
      <div className="container-fluid header bg-white p-0">
        <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-6 p-4 p-md-5 mt-3 mt-lg-5">
            <h1 className="display-5 animated fadeIn mb-3 mb-md-4" style={{ fontSize: 'calc(1.8rem + 1.5vw)' }}>About Us</h1>
            <nav aria-label="breadcrumb animated fadeIn">
              <ol className="breadcrumb text-uppercase">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item text-body active" aria-current="page">About</li>
              </ol>
            </nav>
          </div>
          <div className="col-md-6 wow animate__animated animate__fadeIn">
            <img className="img-fluid w-100" src="img/header.jpg" alt="" style={{ maxHeight: '600px', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
      {/* Header End */}

      {/* About Intro Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4 g-md-5 align-items-center">
            <div className="col-lg-6 wow animate__animated animate__fadeIn" data-wow-delay="0.1s">
              <div className="about-img position-relative overflow-hidden p-4 p-lg-5 pe-0">
                <img className="img-fluid w-100" src="img/about.jpg" alt="About Us" />
              </div>
            </div>
            <div className="col-lg-6 wow animate__animated animate__fadeIn" data-wow-delay="0.5s">
              <h1 className="mb-3 mb-md-4" style={{ fontSize: 'calc(1.5rem + 1vw)' }}>Your Trusted Partner in Real Estate</h1>
              <p className="mb-3 mb-md-4">
                Founded with a vision to revolutionize the real estate industry, we are committed to providing a transparent, efficient, and commission-free property buying experience. Our platform connects property seekers directly with sellers, eliminating unnecessary intermediary costs while maintaining the highest standards of service.
              </p>
              <p><i className="fa fa-check text-primary me-3"></i>Zero commission fees for buyers and sellers</p>
              <p><i className="fa fa-check text-primary me-3"></i>Verified property listings with detailed information</p>
              <p><i className="fa fa-check text-primary me-3"></i>Professional guidance throughout your property journey</p>
              <p><i className="fa fa-check text-primary me-3"></i>Transparent process with no hidden costs</p>
              <a className="btn btn-primary py-2 py-md-3 px-4 px-md-5 mt-3" href="/properties">Explore Properties</a>
            </div>
          </div>
        </div>
      </div>
      {/* About Intro End */}

      {/* Mission Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="bg-light rounded p-3">
            <div className="bg-white rounded p-3 p-md-4" style={{ border: '1px dashed rgba(0, 185, 142, .3)' }}>
              <div className="row g-4 g-md-5 align-items-center">
                <div className="col-lg-6 wow animate__animated animate__fadeIn" data-wow-delay="0.1s">
                  <img className="img-fluid rounded w-100" src="img/call-to-action.jpg" alt="" />
                </div>
                <div className="col-lg-6 wow animate__animated animate__fadeIn" data-wow-delay="0.5s">
                  <div className="mb-4">
                    <h1 className="mb-3" style={{ fontSize: 'calc(1.5rem + 1vw)' }}>Our Mission</h1>
                    <p>We believe that finding your dream property shouldn't cost a fortune in commissions. Our mission is to create a fair marketplace where buyers and sellers can connect directly, supported by our expert team who provide guidance without the traditional commission structure. We're committed to transparency, integrity, and exceptional service at every step of your property journey.</p>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <a href="/contact" className="btn btn-primary py-2 py-md-3 px-3 px-md-4"><i className="fa fa-phone-alt me-2"></i>Contact Us</a>
                    <a href="/properties" className="btn btn-dark py-2 py-md-3 px-3 px-md-4"><i className="fa fa-search me-2"></i>Find Properties</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mission End */}

      {/* Team Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-4 mb-md-5 wow animate__animated animate__fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
            <h1 className="mb-3" style={{ fontSize: 'calc(1.5rem + 1vw)' }}>Our Expert Property Advisors</h1>
            <p className="px-3">Our team of experienced property advisors is dedicated to helping you navigate the real estate market with ease. Unlike traditional agents, our advisors don't work on commission, ensuring that their recommendations are always in your best interest.</p>
          </div>
          {error ? (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          ) : loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center">
              <p>No agents found</p>
            </div>
          ) : (
            <div className="row g-3 g-md-4">
              {agents.map((agent, index) => (
                <div key={agent.id} className="col-12 col-sm-6 col-lg-3 wow animate__animated animate__fadeInUp" data-wow-delay={`0.${index + 1}s`}>
                  <AgentCard agent={agent} variant="about" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Team End */}

      {/* Why Choose Us Start */}
      <div className="container-xxl py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4 mb-md-5">
            <h2 className="mb-3" style={{ fontSize: 'calc(1.5rem + 1vw)' }}>Why Choose Us</h2>
            <p className="px-3">
              We're revolutionizing the real estate industry with our client-first approach and commission-free model.
            </p>
          </div>
          <div className="row g-4 text-center">
            <div className="col-md-4 mb-4 mb-md-0">
              <div>
                <div className="mb-3"><i className="fa fa-dollar-sign fa-2x text-success"></i></div>
                <h5 className="fw-bold">Zero Commission</h5>
                <p>We've eliminated traditional commission fees, saving you thousands on your property transaction. Our transparent pricing model means no surprises.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <div>
                <div className="mb-3"><i className="fa fa-shield-alt fa-2x text-success"></i></div>
                <h5 className="fw-bold">Verified Listings</h5>
                <p>Every property on our platform undergoes a thorough verification process, ensuring you have access to accurate and reliable information.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div>
                <div className="mb-3"><i className="fa fa-handshake fa-2x text-success"></i></div>
                <h5 className="fw-bold">Expert Guidance</h5>
                <p>Our property advisors provide unbiased advice and personalized support throughout your property journey, without commission-based incentives.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Why Choose Us End */}

      {/* Testimonials Section */}
      <TestimonialsCarousel />
    </>
  );
};

export default About;