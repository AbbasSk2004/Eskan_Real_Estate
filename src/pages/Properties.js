import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CategorySection from '../components/home/CategorySection';
import CallToAction from '../components/home/CallToAction';
import SearchForm from '../components/home/SearchForm';
import PropertyList from '../components/properties/PropertyList';

function parseQueryParams(search) {
  const params = new URLSearchParams(search);
  const filters = {};
  for (const [key, value] of params.entries()) {
    if (key === 'priceRange') {
      filters[key] = Number(value);
    } else {
      filters[key] = value;
    }
  }
  return filters;
}

const Properties = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(() => parseQueryParams(location.search));
  const [error, setError] = useState(null);

  // Sync filters from URL if they actually changed
  useEffect(() => {
    const urlFilters = parseQueryParams(location.search);
    if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) {
      setFilters(urlFilters);
    }
    // eslint-disable-next-line
  }, [location.search]);

  // Sync URL from filters if they actually changed
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== '' &&
        value !== undefined &&
        value !== null &&
        !(typeof value === 'number' && isNaN(value))
      ) {
        params.set(key, value);
      }
    });
    if (params.toString() !== location.search.replace(/^\?/, '')) {
      navigate({ pathname: '/properties', search: params.toString() }, { replace: true });
    }
    // eslint-disable-next-line
  }, [filters]);

  // Always derive statusFilter from filters
  const statusFilter = filters.status || 'all';

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status: status === 'all' ? 'all' : status }));
  };

  const handleError = (err) => {
    let message = 'An unexpected error occurred.';
    if (err?.response?.data?.message) {
      message = err.response.data.message;
    } else if (err?.message) {
      message = err.message;
    }
    setError(message);
  };

  const isSearchActive = Object.entries(filters).some(
    ([key, value]) => key !== 'status' && value && value !== ''
  );

  const combinedFilters = { ...filters, status: statusFilter };

  return (
    <>
      {/* Header Start */}
      <div className="container-fluid header bg-white p-0">
        <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-6 p-5 mt-lg-5">
            <h1 className="display-5 animated fadeIn mb-4">Lebanon Property Types & Listings</h1>
            <nav aria-label="breadcrumb animated fadeIn">
              <ol className="breadcrumb text-uppercase">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item text-body active" aria-current="page">Properties</li>
              </ol>
            </nav>
            <p className="text-muted mt-3">
              Discover apartments, villas, offices, and more across Beirut, Mount Lebanon, and all Lebanese regions.
            </p>
          </div>
          <div className="col-md-6 animated fadeIn">
            <img className="img-fluid" src="/img/header.jpg" alt="" />
          </div>
        </div>
      </div>
      {/* Header End */}

      {/* Search Start */}
      <SearchForm onFilter={setFilters} initialFilters={filters} />
      {/* Search End */}

      {/* Property Types Start */}
      {!isSearchActive && <CategorySection />}
      {/* Property Types End */}

      {/* Property List Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-0 gx-5 align-items-end">
            <div className="col-12">
              {!isSearchActive && (
                <div className="text-center mx-auto mb-5 wow slideInLeft" data-wow-delay="0.1s">
                  <h1 className="mb-3">Property Listing</h1>
                  <p>Browse our extensive collection of properties for sale and rent.</p>
                </div>
              )}
              <div className="text-end wow slideInRight" data-wow-delay="0.1s">
                <ul className="nav nav-pills d-inline-flex mb-5">
                  <li className="nav-item me-2">
                    <button
                      className={`btn btn-outline-primary ${statusFilter === 'all' ? 'active' : ''}`}
                      onClick={() => handleStatusFilter('all')}
                    >
                      All
                    </button>
                  </li>
                  <li className="nav-item me-2">
                    <button
                      className={`btn btn-outline-primary ${statusFilter === 'For Sale' ? 'active' : ''}`}
                      onClick={() => handleStatusFilter('For Sale')}
                    >
                      For Sale
                    </button>
                  </li>
                  <li className="nav-item me-0">
                    <button
                      className={`btn btn-outline-primary ${statusFilter === 'For Rent' ? 'active' : ''}`}
                      onClick={() => handleStatusFilter('For Rent')}
                    >
                      For Rent
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <PropertyList filters={combinedFilters} setFilters={setFilters} onError={handleError} />
          <div className="col-12 text-center wow fadeInUp" data-wow-delay="0.1s">
            <Link to="/properties" className="btn btn-primary py-3 px-5 mt-5">Browse More Property</Link>
          </div>
        </div>
      </div>
      {/* Property List End */}

      {/* Call to Action Start */}
      <CallToAction />
      {/* Call to Action End */}
    </>
  );
};

export default Properties;
