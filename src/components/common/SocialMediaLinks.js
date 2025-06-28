import React from 'react';
import PropTypes from 'prop-types';

const SocialMediaLinks = ({ 
  facebook, 
  twitter, 
  instagram, 
  variant = 'light', // light or primary
  showLabels = false,
  className = ''
}) => {
  if (!facebook && !twitter && !instagram) return null;

  const btnClass = `btn btn-${variant === 'light' ? 'light' : 'primary'} btn-square mx-1`;

  return (
    <div className={`d-flex justify-content-center ${className}`}>
      {facebook && (
        <a className={btnClass} href={facebook} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
          {showLabels && <span className="ms-1">Facebook</span>}
        </a>
      )}
      {twitter && (
        <a className={btnClass} href={twitter} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
          {showLabels && <span className="ms-1">Twitter</span>}
        </a>
      )}
      {instagram && (
        <a className={btnClass} href={instagram} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
          {showLabels && <span className="ms-1">Instagram</span>}
        </a>
      )}
    </div>
  );
};

SocialMediaLinks.propTypes = {
  facebook: PropTypes.string,
  twitter: PropTypes.string,
  instagram: PropTypes.string,
  variant: PropTypes.oneOf(['light', 'primary']),
  showLabels: PropTypes.bool,
  className: PropTypes.string
};

export default SocialMediaLinks; 