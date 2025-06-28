import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon, title, message, actionText, actionLink }) => {
  return (
    <div className="text-center py-5">
      <i className={`fa ${icon} fa-3x text-muted mb-3`}></i>
      <h5>{title}</h5>
      <p className="text-muted">{message}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;