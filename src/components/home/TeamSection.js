import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { endpoints } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { experienceLabel } from '../../utils/agentConstants';

const TeamSection = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await endpoints.agents.getFeatured();
        
        if (!response?.data?.success) {
          console.error('Invalid response format:', response?.data);
          throw new Error('Invalid response format from server');
        }
        
        // Transform data to match the schema
        const formattedAgents = response.data?.data?.map(agent => ({
          id: agent.id,
          full_name: `${agent.firstname || ''} ${agent.lastname || ''}`.trim(),
          profile_photo: agent.profile_photo || agent.image,
          specialization: agent.specialty,
          experience: agent.experience,
          social_links: {
            facebook: agent.facebook_url,
            twitter: agent.twitter_url,
            instagram: agent.instagram_url,
            whatsapp: agent.phone ? `https://wa.me/${agent.phone.replace(/\D/g, '')}` : null
          }
        })) || [];
        
        setAgents(formattedAgents);
        setError(null);
      } catch (error) {
        console.error('Error fetching agents:', error);
        setError('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!agents.length) return null;

  return (
    <section className="container-xxl py-5">
      <div className="container">
        <div className="text-center mx-auto mb-4 mb-md-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <h1 className="mb-3" style={{ fontSize: 'calc(1.5rem + 1vw)' }}>Our Expert Agents</h1>
          <p>Meet our team of experienced real estate professionals</p>
        </div>
        <div className="row g-3 g-md-4">
          {agents.map((agent, index) => (
            <div key={agent.id} className="col-12 col-sm-6 col-lg-3 wow fadeInUp" data-wow-delay={`${0.1 + index * 0.2}s`}>
              <div className="team-item rounded overflow-hidden">
                <div className="position-relative">
                  <img 
                    className="img-fluid w-100" 
                    src={agent.profile_photo || '/img/default-agent.jpg'} 
                    alt={agent.full_name}
                    style={{ 
                      height: '250px',
                      maxHeight: '300px', 
                      objectFit: 'cover',
                      objectPosition: 'center top'
                    }}
                  />
                  <div className="position-absolute start-50 top-100 translate-middle d-flex align-items-center">
                    {agent.social_links?.facebook && (
                      <a className="btn btn-square mx-1" href={agent.social_links.facebook} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    )}
                    {agent.social_links?.twitter && (
                      <a className="btn btn-square mx-1" href={agent.social_links.twitter} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter"></i>
                      </a>
                    )}
                    {agent.social_links?.instagram && (
                      <a className="btn btn-square mx-1" href={agent.social_links.instagram} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram"></i>
                      </a>
                    )}
                    {agent.social_links?.whatsapp && (
                      <a className="btn btn-square mx-1" href={agent.social_links.whatsapp} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-whatsapp"></i>
                      </a>
                    )}
                  </div>
                </div>
                <div className="text-center p-3 p-md-4 mt-3">
                  <h5 className="fw-bold mb-0">{agent.full_name}</h5>
                  <small>{agent.specialization || 'Real Estate Agent'}</small>
                  <p className="text-muted mt-2 mb-3">{experienceLabel(agent.experience)}</p>
                  <Link to={`/agent/${agent.id}`} className="btn btn-primary px-3 px-md-4">View Profile</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;