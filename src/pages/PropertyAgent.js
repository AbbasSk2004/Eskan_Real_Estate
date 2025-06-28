import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AgentList from '../components/agent/AgentList';
import AgentApplicationModal from '../components/agent/AgentApplicationModal';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../services/api';

const PropertyAgent = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasApplication, setHasApplication] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      checkApplicationStatus();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const checkApplicationStatus = async () => {
    try {
      const response = await endpoints.agents.getApplicationDetails();
      setHasApplication(!!response?.data);
      setLoading(false);
    } catch (error) {
      console.error('Error checking application status:', error);
      setLoading(false);
    }
  };

  const handleBecomeAgentClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="container-fluid header bg-white p-0">
        <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-6 p-5 mt-lg-5">
            <h1 className="display-5 animated fadeIn mb-4">Property Agent</h1>
            <nav aria-label="breadcrumb animated fadeIn">
              <ol className="breadcrumb text-uppercase">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item text-body active" aria-current="page">Property Agent</li>
              </ol>
            </nav>
          </div>
          <div className="col-md-6 animated fadeIn">
            <img className="img-fluid" src="/img/header.jpg" alt="" />
          </div>
        </div>
      </div>
    
      {/* Agent List Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
            <h1 className="mb-3">Our Property Agents</h1>
            <p>Meet our experienced real estate agents who are here to help you find your perfect property.</p>
          </div>

          <div className="mt-5">
            <AgentList />
          </div>

          {!loading && !hasApplication && (
            <div className="text-center mt-5">
              <button className="btn btn-primary py-3 px-5" onClick={handleBecomeAgentClick}>
                <i className="fa fa-user-plus me-2"></i>Become an Agent
              </button>
            </div>
          )}

        </div>
      </div>

      <AgentApplicationModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onApplicationSubmitted={() => setHasApplication(true)}
      />

      {/* Call to Action Start */}
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
                    <p>
                      Our certified agents are ready to help you buy, sell, or rent your next property. Contact us today for expert advice and personalized service.
                    </p>
                  </div>
                  <a href="tel:+1234567890" className="btn btn-primary py-3 px-4 me-2">
                    <i className="fa fa-phone-alt me-2"></i>Make A Call
                  </a>
                  <a href="/" className="btn btn-dark py-3 px-4" role="button" tabIndex="0">
                    <i className="fa fa-calendar-alt me-2"></i>Get Appointment
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Call to Action End */}
    </>
  );
};

export default PropertyAgent;