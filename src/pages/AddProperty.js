import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddPropertyForm from '../components/properties/AddPropertyForm';

const AddProperty = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated() || !currentUser) {
      navigate('/login');
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Optionally, show nothing or a loading spinner while checking
  if (!isAuthenticated() || !currentUser) return null;

  return (
    <>
      {/* Header Start */}
      <div className="container-fluid header bg-white p-0">
        <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-6 p-5 mt-lg-5">
            <h1 className="display-5 animated fadeIn mb-4">List Your Property</h1>
            <nav aria-label="breadcrumb animated fadeIn">
              <ol className="breadcrumb text-uppercase">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item text-body active" aria-current="page">Add Property</li>
              </ol>
            </nav>
          </div>
          <div className="col-md-6 animated fadeIn">
            <img className="img-fluid" src="/img/header.jpg" alt="Add Property" />
          </div>
        </div>
      </div>
      {/* Header End */}

      {/* Add Property Form Start */}
      <AddPropertyForm />
      {/* Add Property Form End */}
    </>
  );
};

export default AddProperty;