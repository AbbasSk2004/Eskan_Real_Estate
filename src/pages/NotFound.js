import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container-fluid py-5" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="py-5">
              <h1 className="display-1 text-primary fw-bold">404</h1>
              <h2 className="mb-4">Page Not Found</h2>
              <p className="text-muted mb-4">
                Sorry, the page you are looking for doesn't exist or has been moved.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/" className="btn btn-primary">
                  <i className="fa fa-home me-2"></i>
                  Go Home
                </Link>
                <Link to="/properties" className="btn btn-outline-primary">
                  <i className="fa fa-building me-2"></i>
                  Browse Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
