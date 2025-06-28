import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const withDatabaseCheck = (WrappedComponent) => {
  return function WithDatabaseCheckComponent(props) {
    const { isDbConnected, isChecking, checkDatabaseConnection } = useDatabase();

    if (isChecking) {
      return <LoadingSpinner />;
    }

    if (!isDbConnected) {
      return (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Database Connection Error</h4>
          <p>Unable to connect to the database. Please check your connection and try again.</p>
          <hr />
          <button 
            className="btn btn-primary" 
            onClick={checkDatabaseConnection}
          >
            Retry Connection
          </button>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}; 