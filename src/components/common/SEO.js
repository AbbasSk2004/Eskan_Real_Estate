import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component to inject meta tags for each page.
 *
 * Usage:
 * <SEO title="Home" description="Find your dream property..." />
 */
const SEO = ({ title, description, image, url, type = 'website' }) => {
  const siteName = 'Eskan Real Estate';
  const defaultImage = `${process.env.PUBLIC_URL}/logo512.png`;
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={pageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string
};

export default SEO; 