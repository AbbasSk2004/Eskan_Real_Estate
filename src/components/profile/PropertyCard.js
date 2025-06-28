import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl } from '../../utils/imageUtils';
import { endpoints } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PropertyCard = ({ 
  property, 
  onDelete,
  showActions = false
}) => {
  const { user } = useAuth();
  const [viewCount, setViewCount] = useState(property.views_count || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const viewCountRef = useRef(null);
  const abortController = useRef(null);

  const {
    id,
    title,
    status,
    price,
    main_image
  } = property;

  // Fetch view count if not provided
  useEffect(() => {
    const fetchViewCount = async () => {
      // Skip if we already have the view count or if it's already being fetched
      if (typeof property.views_count === 'number' || viewCountRef.current === property.id) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        viewCountRef.current = property.id;

        // Create new abort controller
        abortController.current = new AbortController();
        
        // Just get the view count without recording a view
        const response = await endpoints.propertyViews.getViewCount(property.id);

        // Handle both numeric and object responses for backward compatibility
        const count = typeof response === 'number'
          ? response
          : (response?.data?.count ?? 0);

        setViewCount(count);
      } catch (error) {
        // Only set error if not aborted
        if (!error.name === 'AbortError') {
          setError(error.message || 'Failed to fetch view count');
          console.error('View count error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchViewCount();

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [property.id, property.views_count]);

  const statusConfig = {
    available: { label: 'Available', className: 'success' },
    pending: { label: 'Pending', className: 'warning' },
    sold: { label: 'Sold', className: 'danger' },
    rented: { label: 'Rented', className: 'info' }
  };

  const currentStatus = statusConfig[status] || { label: status, className: 'secondary' };

  return (
    <div className="card h-100 property-card">
      <div className="position-relative">
        <img
          src={getImageUrl(main_image) || '/img/property-placeholder.jpg'}
          className="card-img-top"
          alt={title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        
        {/* Status Badge - Top Left */}
        <span className={`badge bg-${currentStatus.className} position-absolute top-0 start-0 m-2`}>
          {currentStatus.label}
        </span>
        
        {/* Views Badge - Top Right */}
        <span className="badge bg-white text-dark position-absolute top-0 end-0 m-2">
          <i className="fa fa-eye text-danger me-1"></i>
          {loading ? (
            <small className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </small>
          ) : error ? (
            <span title={error}>--</span>
          ) : (
            viewCount
          )}
        </span>
      </div>

      <div className="card-body">
        <h5 className="card-title text-truncate mb-2">{title}</h5>
        <p className="text-primary h5 mb-4">{formatPrice(price)}</p>

        {/* Action Buttons */}
        <div className="d-flex justify-content-between align-items-center">
          <Link 
            to={`/properties/${id}`} 
            className="btn btn-outline-primary"
          >
            Show Details
          </Link>
          {showActions && onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="btn btn-outline-danger"
              title="Delete Property"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;