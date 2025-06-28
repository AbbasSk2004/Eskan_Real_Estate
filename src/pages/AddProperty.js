import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import PropertyForm from '../components/properties/PropertyForm';
import { toast } from 'react-toastify';

const AddProperty = () => {
  const { isAuthenticated } = useAuth();
  // Track whether the property was submitted successfully
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmitSuccess = () => {
    toast.success('Your property has been submitted! We will review it within 24 hours.');
    setIsSubmitted(true);
  };

  return (
    <div className="add-property-page">
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-1">Add New Property</h1>
                <p className="text-muted">Fill in the details below to list your property</p>
              </div>
              <div className="text-end">
                <small className="text-muted">
                  <i className="fa fa-info-circle me-1"></i>
                  Fields marked with * are required
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isSubmitted ? (
        <div className="container py-5">
          <div className="alert alert-info text-center" role="alert">
            Your property has been submitted successfully and is now under review. We typically review listings within 24&nbsp;hours.
          </div>
        </div>
      ) : (
        <PropertyForm mode="create" onSubmitSuccess={handleSubmitSuccess} />
      )}
    </div>
  );
};

export default AddProperty;