import React from 'react';
import { useApi } from '../context/ApiContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const withApiCheck = (WrappedComponent) => {
  return function WithApiCheckComponent(props) {
    const { isConnected, isChecking } = useApi();

    if (isChecking) {
      return <LoadingSpinner />;
    }

    if (!isConnected) {
      return (
        <div className="alert alert-danger" role="alert">
          Unable to connect to server. Please check your connection and try again.
          <button
            className="btn btn-link"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}; 