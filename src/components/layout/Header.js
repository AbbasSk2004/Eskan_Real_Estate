import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ 
  title, 
  breadcrumbs = [], 
  showBreadcrumbs = true,
  backgroundImage = '/img/header-bg.jpg',
  className = ''
}) => {
  return (
    <div className={`container-fluid header bg-white p-0 ${className}`}>
      <div 
        className="header-container position-relative"
        style={{
          backgroundImage: `linear-gradient(rgba(43, 57, 64, .5), rgba(43, 57, 64, .5)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-content text-center text-white py-5">
                {/* Page Title */}
                {title && (
                  <h1 className="display-4 animated slideInDown mb-4">
                    {title}
                  </h1>
                )}

                {/* Breadcrumbs */}
                {showBreadcrumbs && breadcrumbs.length > 0 && (
                  <nav aria-label="breadcrumb" className="animated slideInDown">
                    <ol className="breadcrumb justify-content-center mb-0">
                      <li className="breadcrumb-item">
                        <Link to="/" className="text-white">
                          <i className="fas fa-home me-2"></i>
                          Home
                        </Link>
                      </li>
                      {breadcrumbs.map((crumb, index) => (
                        <li 
                          key={index} 
                          className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                        >
                          {index === breadcrumbs.length - 1 ? (
                            <span className="text-primary">{crumb.label}</span>
                          ) : (
                            <Link to={crumb.path} className="text-white">
                              {crumb.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .header-container {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .header-content {
          padding: 80px 0;
        }

        .display-4 {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .breadcrumb {
          display: inline-flex;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 30px;
        }

        .breadcrumb-item + .breadcrumb-item::before {
          color: #ffffff;
        }

        .breadcrumb-item a {
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .breadcrumb-item a:hover {
          color: #00B98E !important;
        }

        .breadcrumb-item.active .text-primary {
          color: #00B98E !important;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 60px 0;
          }

          .display-4 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

// Default breadcrumb configurations for common pages
export const getPageBreadcrumbs = (pageName, additionalCrumbs = []) => {
  const baseBreadcrumbs = {
    properties: [
      { label: 'Properties', path: '/properties' }
    ],
    'property-detail': [
      { label: 'Properties', path: '/properties' },
      { label: 'Property Details', path: '#' }
    ],
    'add-property': [
      { label: 'Properties', path: '/properties' },
      { label: 'Add Property', path: '/add-property' }
    ],
    about: [
      { label: 'About Us', path: '/about' }
    ],
    contact: [
      { label: 'Contact Us', path: '/contact' }
    ],
    agents: [
      { label: 'Our Agents', path: '/agents' }
    ],
    profile: [
      { label: 'My Profile', path: '/profile' }
    ],
    favorites: [
      { label: 'My Favorites', path: '/favorites' }
    ]
  };

  const breadcrumbs = baseBreadcrumbs[pageName] || [];
  return [...breadcrumbs, ...additionalCrumbs];
};

export default Header;