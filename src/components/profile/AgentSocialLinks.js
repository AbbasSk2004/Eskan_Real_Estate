import React from 'react';

const AgentSocialLinks = ({ facebook, twitter, instagram }) => {
  // Helper function to validate and format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    try {
      // Add https:// if no protocol is specified
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      new URL(url); // This will throw if URL is invalid
      return url;
    } catch (e) {
      console.warn('Invalid URL:', url);
      return null;
    }
  };

  const formattedFacebook = formatUrl(facebook);
  const formattedTwitter = formatUrl(twitter);
  const formattedInstagram = formatUrl(instagram);

  if (!formattedFacebook && !formattedTwitter && !formattedInstagram) {
    return null;
  }

  return (
    <div className="mt-3">
      <strong>Social Media:</strong>
      <div className="mt-2">
        {formattedFacebook && (
          <a 
            href={formattedFacebook} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline-primary btn-sm me-2"
            title="Visit Facebook Profile"
          >
            <i className="fab fa-facebook-f me-1"></i>
            Facebook
          </a>
        )}
        {formattedTwitter && (
          <a 
            href={formattedTwitter} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline-info btn-sm me-2"
            title="Visit Twitter Profile"
          >
            <i className="fab fa-twitter me-1"></i>
            Twitter
          </a>
        )}
        {formattedInstagram && (
          <a 
            href={formattedInstagram} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline-danger btn-sm"
            title="Visit Instagram Profile"
          >
            <i className="fab fa-instagram me-1"></i>
            Instagram
          </a>
        )}
      </div>
    </div>
  );
};

export default AgentSocialLinks;