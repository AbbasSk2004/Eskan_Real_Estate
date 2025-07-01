import React, { useState } from 'react';
import { experienceLabel } from '../../utils/agentConstants';
import { getImageUrl } from '../../utils/imageUtils';
import './AgentCard.css'; // We'll create this next

const AgentCard = ({ agent, variant = 'default' }) => {
  const fullName = `${agent.profiles?.firstname || ''} ${agent.profiles?.lastname || ''}`.trim();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Process agent's image with proper handling for both string and object formats
  let displayImage = '/img/default-agent.jpg';
  
  if (agent.image) {
    if (typeof agent.image === 'object' && agent.image.url) {
      displayImage = agent.image.url;
    } else if (typeof agent.image === 'string') {
      displayImage = agent.image.startsWith('http') 
        ? agent.image 
        : getImageUrl(agent.image);
    }
  }

  // Format phone number for WhatsApp by removing non-digits
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  };

  if (!agent) {
    return null;
  }

  // Apply variant-specific classes
  const cardClass = `team-item agent-card agent-card-${variant} rounded overflow-hidden`;

  // Style for image based on variant
  const imageContainerClass = `agent-image-container ${imageLoaded ? 'loaded' : 'loading'} ${imageError ? 'error' : ''}`;

  return (
    <div className={cardClass}>
      <div className="position-relative">
        <div className={imageContainerClass}>
          {!imageLoaded && !imageError && (
            <div className="agent-image-placeholder">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <img 
            className="img-fluid agent-image w-100"
            src={imageError ? '/img/default-agent.jpg' : displayImage}
            alt={fullName}
            style={{ opacity: imageLoaded && !imageError ? 1 : 0 }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        </div>
        <div className="position-absolute start-50 top-100 translate-middle d-flex align-items-center agent-social">
          {agent.facebook_url && (
            <a className="btn btn-square mx-1" href={agent.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
          )}
          {agent.twitter_url && (
            <a className="btn btn-square mx-1" href={agent.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
          )}
          {agent.instagram_url && (
            <a className="btn btn-square mx-1" href={agent.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          )}
          {agent.phone && (
            <a className="btn btn-square mx-1" href={`https://wa.me/${formatPhoneForWhatsApp(agent.phone)}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <i className="fab fa-whatsapp"></i>
            </a>
          )}
        </div>
      </div>
      <div className="text-center p-3 p-md-4 mt-3 agent-info">
        <h5 className="fw-bold mb-0">{fullName}</h5>
        <div className="text-primary mb-2">{agent.specialty || 'Real Estate Agent'}</div>
        <div className="agent-experience">
          <span className="badge bg-light text-dark border border-primary px-2 px-md-3 py-1 py-md-2">
            <i className="far fa-clock text-primary me-1"></i>
            {experienceLabel(agent.experience) || '0'} Years Experience
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;