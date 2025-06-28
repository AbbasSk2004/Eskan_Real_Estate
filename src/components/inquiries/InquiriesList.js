import React, { useState, useEffect } from 'react';
import { endpoints } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const InquiriesList = ({ type = 'received' }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const response = await endpoints.contact.getInquiries(type);
        setInquiries(response.data || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
        setError('Failed to load inquiries');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [type]);

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      await endpoints.contact.updateInquiryStatus(inquiryId, newStatus);
      setInquiries(inquiries.map(inquiry => 
        inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
      ));
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-5">
        <h5>No inquiries found</h5>
        <p className="text-muted">
          {type === 'received' 
            ? 'You haven\'t received any inquiries yet.'
            : 'You haven\'t sent any inquiries yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="inquiries-list">
      {inquiries.map(inquiry => (
        <div key={inquiry.id} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="card-title mb-1">
                  <Link to={`/property/${inquiry.property.id}`}>
                    {inquiry.property.title}
                  </Link>
                </h5>
                <p className="text-muted small mb-2">
                  {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                </p>
              </div>
              {type === 'received' && (
                <div className="dropdown">
                  <button 
                    className={`btn btn-sm btn-${getStatusColor(inquiry.status)}`}
                    type="button"
                    id={`dropdownStatus${inquiry.id}`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby={`dropdownStatus${inquiry.id}`}>
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={() => handleStatusUpdate(inquiry.id, 'pending')}
                      >
                        Pending
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={() => handleStatusUpdate(inquiry.id, 'in_progress')}
                      >
                        In Progress
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={() => handleStatusUpdate(inquiry.id, 'resolved')}
                      >
                        Resolved
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={() => handleStatusUpdate(inquiry.id, 'closed')}
                      >
                        Closed
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="row mt-3">
              <div className="col-md-8">
                <p className="mb-2">{inquiry.message}</p>
                <div className="d-flex gap-3 text-muted small">
                  <span>
                    <i className="fa fa-user me-1"></i>
                    {type === 'received' ? inquiry.sender_name : inquiry.receiver_name}
                  </span>
                  {inquiry.sender_phone && (
                    <span>
                      <i className="fa fa-phone me-1"></i>
                      {inquiry.sender_phone}
                    </span>
                  )}
                  <span>
                    <i className="fa fa-envelope me-1"></i>
                    {type === 'received' ? inquiry.sender_email : inquiry.receiver_email}
                  </span>
                </div>
              </div>
              <div className="col-md-4">
                {inquiry.property.main_image && (
                  <Link to={`/property/${inquiry.property.id}`}>
                    <img 
                      src={inquiry.property.main_image} 
                      alt={inquiry.property.title}
                      className="img-fluid rounded"
                      style={{ maxHeight: '100px', width: '100%', objectFit: 'cover' }}
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'resolved':
      return 'success';
    case 'closed':
      return 'secondary';
    default:
      return 'primary';
  }
};

export default InquiriesList; 