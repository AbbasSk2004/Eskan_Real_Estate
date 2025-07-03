import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = ({ agentApplication }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Quick Actions</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4 mb-3">
            <Link to="/add-property" className="btn btn-primary w-100">
              <i className="fa fa-plus me-2"></i>
              Add New Property
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            <Link to="/properties" className="btn btn-outline-primary w-100">
              <i className="fa fa-search me-2"></i>
              Browse Properties
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            {!agentApplication ? (
              <Link to="/property-agent" className="btn btn-outline-success w-100">
                <i className="fa fa-user-tie me-2"></i>
                Become an Agent
              </Link>
            ) : (
              <button className="btn btn-outline-secondary w-100" disabled>
                <i className="fa fa-user-tie me-2"></i>
                Agent Application Submitted
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;