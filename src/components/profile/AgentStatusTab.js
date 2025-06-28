import React, { useEffect, useState } from 'react';
import { getImageUrl } from '../../utils/imageUtils';
import AgentStatusBadge from './AgentStatusBadge';
import AgentSocialLinks from './AgentSocialLinks';
import api from '../../services/api';
import EmptyState from './EmptyState';

const AgentStatusTab = () => {
  const [agentApplication, setAgentApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgentApplication = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch agent application details – the axios interceptor will
        // automatically attach the authentication token (if available).
        const response = await api.get('/agents/applications/details');

        if (response.data?.success) {
          setAgentApplication(response.data.data);
        } else {
          // If no application exists, this is expected for new users
          setAgentApplication(null);
        }
      } catch (err) {
        console.error('Get application details error:', err);
        setError(err.message || 'Failed to fetch agent application details');
      } finally {
        setLoading(false);
      }
    };

    fetchAgentApplication();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon="fa-exclamation-circle"
        title="Error Loading Application"
        message={error}
        actionText="Try Again"
        actionLink="/profile"
      />
    );
  }

  if (!agentApplication) {
    return (
      <EmptyState
        icon="fa-user-tie"
        title="No Agent Application Found"
        message="You haven't submitted an agent application yet."
        actionText="Apply to Become an Agent"
        actionLink="/agent-application"
      />
    );
  }

  return (
    <div>
      <h4 className="mb-4">Agent Application Status</h4>
      
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Application Details</h5>
          <AgentStatusBadge status={agentApplication.status} />
        </div>
        <div className="card-body">
          <div className="row">
            {/* Profile Photo */}
            <div className="col-md-4 text-center mb-4">
              {agentApplication.image ? (
                <img
                  src={getImageUrl(agentApplication.image)}
                  alt="Agent Profile"
                  className="rounded-circle mb-3"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '120px', height: '120px' }}
                >
                  <i className="fa fa-user fa-3x text-white"></i>
                </div>
              )}
              <h6>
                {agentApplication.profiles?.firstname} {agentApplication.profiles?.lastname}
              </h6>
            </div>

            {/* Agent Details */}
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <strong>Email:</strong>
                  <p className="mb-0">{agentApplication.profiles?.email}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Phone:</strong>
                  <p className="mb-0">{agentApplication.phone}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Specialty:</strong>
                  <p className="mb-0">{agentApplication.specialty}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Experience:</strong>
                  <p className="mb-0">{agentApplication.experience}</p>
                </div>
                <div className="col-12 mb-3">
                  <strong>About Me:</strong>
                  <p className="mb-0">{agentApplication.about_me}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Application Date:</strong>
                  <p className="mb-0">
                    {new Date(agentApplication.created_at).toLocaleDateString()}
                  </p>
                </div>
                {agentApplication.approved_at && (
                  <div className="col-md-6 mb-3">
                    <strong>Approved Date:</strong>
                    <p className="mb-0">
                      {new Date(agentApplication.approved_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Social Media Links */}
              <AgentSocialLinks 
                facebook={agentApplication.facebook_url}
                twitter={agentApplication.twitter_url}
                instagram={agentApplication.instagram_url}
              />
              
              {/* CV/Resume Download */}
              {agentApplication.cv_resume_url && (
                <div className="mt-3">
                  <a 
                    href={getImageUrl(agentApplication.cv_resume_url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary"
                  >
                    <i className="fa fa-download me-2"></i>
                    Download CV/Resume
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {/* Status Messages */}
          <AgentStatusMessage status={agentApplication.status} />
        </div>
      </div>
    </div>
  );
};

const AgentStatusMessage = ({ status }) => {
  const statusConfig = {
    pending: {
      class: 'alert-warning',
      icon: 'fa-clock',
      message: 'Your agent application is currently under review. We\'ll notify you once a decision has been made.'
    },
    approved: {
      class: 'alert-success',
      icon: 'fa-check-circle',
      message: 'Congratulations! Your agent application has been approved. You can now access agent features.'
    },
    rejected: {
      class: 'alert-danger',
      icon: 'fa-times-circle',
      message: 'Unfortunately, your agent application was not approved at this time. You may reapply in the future.'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className="mt-4">
      <div className={`alert ${config.class}`}>
        <i className={`fa ${config.icon} me-2`}></i>
        {config.message}
      </div>
    </div>
  );
};

export default AgentStatusTab;