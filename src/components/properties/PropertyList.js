import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { endpoints } from '../../services/api';
import { PROPERTY_TYPE_FIELDS, CARD_FIELD_ICONS } from '../../utils/propertyTypeFields';

const SUPABASE_PUBLIC_URL = 'https://mmgfvjgstcpqmlhctlw.supabase.co/storage/v1/object/public/property-images/';

function getImageUrl(path) {
  if (!path) return '/img/property-placeholder.jpg';
  // If already a full URL, return as is
  if (path.startsWith('http')) return path;
  return SUPABASE_PUBLIC_URL + path;
}

const PropertyList = ({ filters, setFilters, onError }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renderError, setRenderError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await endpoints.getProperties(filters);
        setProperties(response.data);
      } catch (error) {
        setProperties([]);
        if (onError) onError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [filters, onError]);

  const handleRenderError = (error, property) => {
    setRenderError(
      `Error rendering property "${property?.title || 'Unknown'}": ${error.message}`
    );
    // Optionally log to an external service here
    return null;
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setFilters(prev => ({ ...prev, status: status === 'all' ? 'all' : status }));
  };

  const filteredProperties = properties;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading properties...</p>
      </div>
    );
  }

  if (renderError) {
    return (
      <div className="alert alert-danger" role="alert">
        {renderError}
      </div>
    );
  }

  return (
    <div className="row g-4">
      {filteredProperties.map((property) => {
        try {
          const agent = property.agent || {};
          const agentImage = agent.image || '/img/agent-placeholder.jpg';
          const agentName = agent.name || 'No Agent';

          // Get property type name from either property_type_name or property_types.name
          const propertyTypeName = property.property_type_name || 
                                  (property.property_types && property.property_types.name) || 
                                  property.propertyType || 
                                  'Apartment'; // Default to Apartment if no type found

          const typeConfig = PROPERTY_TYPE_FIELDS[propertyTypeName] || {};
          const cardFields = typeConfig.cardFields || [];

          return (
            <div key={property.id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="property-item rounded overflow-hidden">
                <div className="position-relative overflow-hidden">
                  <Link to={`/property/${property.id}`}>
                    <div style={{ width: '100%', height: '250px', overflow: 'hidden', background: '#f5f5f5' }}>
                      <img
                        className="img-fluid"
                        src={getImageUrl(property.main_image)}
                        alt={property.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block'
                        }}
                        loading="lazy"
                      />
                    </div>
                  </Link>
                  <div className="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">
                    {property.status ? property.status.charAt(0).toUpperCase() + property.status.slice(1) : 'For Sale'}
                  </div>
                  <div className="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">
                    {property.price ? `$${Number(property.price).toLocaleString()}` : 'Contact'}
                  </div>
                </div>
                <div className="p-4 pb-0">
                  <h5 className="text-primary mb-3">{property.title}</h5>
                  <p className="d-block h6 mb-2 text-uppercase">
                    <i className="fa fa-map-marker-alt text-primary me-2"></i>
                    {(property.city ? property.city : '')}
                    {property.city && property.governorate ? ', ' : ''}
                    {(property.governorate ? property.governorate : '')}
                  </p>
                  <div className="d-flex mb-3">
                    {(() => {
                      // Get up to 4 fields with values (handle camelCase and snake_case)
                      const shownFields = [];
                      for (let i = 0; i < cardFields.length && shownFields.length < 4; i++) {
                        const field = cardFields[i];
                        let value = property[field];
                        // Support snake_case fallback
                        if ((value === undefined || value === null || value === '') && field.match(/[A-Z]/)) {
                          const snake = field.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
                          value = property[snake];
                        }
                        if (value !== undefined && value !== null && value !== '') {
                          shownFields.push({ field, value });
                        }
                      }
                      return shownFields.map(({ field, value }) => {
                        let iconInfo = CARD_FIELD_ICONS[field];
                        // Special case for farmArea: use area icon, no label, show m²
                        if (field === 'farmArea') {
                          iconInfo = CARD_FIELD_ICONS['area'];
                          return (
                            <small className="me-2" key={field}>
                              <span className="material-icons text-primary me-1" style={{ verticalAlign: 'middle', fontSize: '20px' }}>
                                {iconInfo.icon}
                              </span>
                              {value} m²
                            </small>
                          );
                        }
                        if (!iconInfo) return null;
                        return (
                          <small className="me-2" key={field}>
                            <span className="material-icons text-primary me-1" style={{ verticalAlign: 'middle', fontSize: '20px' }}>
                              {iconInfo.icon}
                            </span>
                            {value} {iconInfo.label}
                          </small>
                        );
                      });
                    })()}
                  </div>
                </div>
                <div className="d-flex border-top justify-content-end align-items-end" style={{ minHeight: '56px' }}>
                  <Link
                    to={`/property/${property.id}`}
                    className="btn btn-outline-primary btn-sm m-2 px-3"
                    style={{ borderRadius: '8px' }}
                  >
                    View Detail
                  </Link>
                </div>
              </div>
            </div>
          );
        } catch (error) {
          return handleRenderError(error, property);
        }
      })}
    </div>
  );
};

export default PropertyList;