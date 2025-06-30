import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropertyFilters from '../components/properties/PropertyFilters';
import PropertyList from '../components/properties/PropertyList';
import { toast } from 'react-hot-toast';
import { propertyService } from '../services/propertyService';
import '../assets/css/properties.css';
import { useDebounce } from '../hooks/useDebounce';
import { COMMON_FEATURES } from '../utils/propertyTypeFields';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    keyword: '',
    propertyType: '',
    status: '',
    governorate: '',
    city: '',
    village: '',
    priceMin: '',
    priceMax: '',
    areaMin: '',
    areaMax: '',
    bedrooms: '',
    bathrooms: '',
    sortBy: 'newest',
    verified: true
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    pageSize: 12
  });

  // Increase debounce time to reduce API calls
  const debouncedKeyword = useDebounce(filters.keyword, 800);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        sortBy: filters.sortBy,
        verified: true,
        // Only include filters that have values
        ...(debouncedKeyword && { keyword: debouncedKeyword.trim() }), // Use debounced value
        ...(filters.propertyType && { propertyType: filters.propertyType }),
        ...(filters.status && { status: filters.status }),
        ...(filters.governorate && { governorate: filters.governorate }),
        ...(filters.city && { city: filters.city }),
        ...(filters.village && { village: filters.village }),
        ...(filters.priceMin && { priceMin: Number(filters.priceMin) }),
        ...(filters.priceMax && { priceMax: Number(filters.priceMax) }),
        ...(filters.areaMin && { areaMin: Number(filters.areaMin) }),
        ...(filters.areaMax && { areaMax: Number(filters.areaMax) }),
        ...(filters.bedrooms && { bedrooms: Number(filters.bedrooms) }),
        ...(filters.bathrooms && { bathrooms: Number(filters.bathrooms) }),
        // Build features list from filters (keys matching COMMON_FEATURES with truthy value)
        ...(() => {
          const featureKeys = Object.keys(COMMON_FEATURES);
          const selected = featureKeys.filter(key => filters[key]);
          return selected.length ? { features: selected.join(',') } : {};
        })()
      };

      const response = await propertyService.getProperties(params);

      if (response.success) {
        setProperties(response.properties || []);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalCount: response.totalCount,
          pageSize: response.pageSize
        });
      } else {
        throw new Error(response.message || 'Failed to fetch properties');
      }
    } catch (err) {
      setError('Failed to fetch properties');
      toast.error('Failed to load properties. Please try again later.');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, filters, debouncedKeyword]);

  // Effect for fetching properties when filters or pagination changes
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (key, value) => {
    if (key === 'keyword') {
      // For keyword/search, just update the filter without validation
      setFilters(prev => ({ ...prev, [key]: value }));
    } else {
      // For other filters, keep existing logic
      setFilters(prev => ({ ...prev, [key]: value }));
    }
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      propertyType: '',
      status: '',
      governorate: '',
      city: '',
      village: '',
      priceMin: '',
      priceMax: '',
      areaMin: '',
      areaMax: '',
      bedrooms: '',
      bathrooms: '',
      sortBy: 'newest',
      verified: true
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      // Exclude sortBy and verified from filter count
      if (key === 'sortBy' || key === 'verified') return false;
      return value && value !== '';
    }).length;
  };

  return (
    <>
      {/* Header Start */}
      <div className="container-fluid header bg-white p-0">
        <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-6 p-5 mt-lg-5">
            <h1 className="display-5 animated fadeIn mb-4">
              Lebanon Property Types & Listings
            </h1>
            <nav aria-label="breadcrumb animated fadeIn">
              <ol className="breadcrumb text-uppercase">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item text-body active" aria-current="page">
                  Properties
                </li>
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

      <div className="container-fluid py-5 px-4 px-lg-5">
        <div className="container-fluid">
          {/* Search and Sort Bar */}
          <div className="row mb-4">
            <div className="col-lg-6">
              <div className="search-bar">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search properties by title..."
                    value={filters.keyword || ''}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={() => fetchProperties()} // Add manual search button
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className="fa fa-search"></i>
                    )}
                  </button>
                </div>
                {filters.keyword && (
                  <small className="text-muted mt-1 d-block">
                    Press Enter or click search to find properties
                  </small>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="d-flex justify-content-end align-items-center">
                {/* View Mode Toggle */}
                <div className="btn-group me-3">
                  <button
                    className={`btn btn-outline-primary ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <i className="fa fa-th-large"></i>
                  </button>
                  <button
                    className={`btn btn-outline-primary ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="fa fa-list"></i>
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  className="form-select"
                  style={{ width: 'auto' }}
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="area_low">Area: Low to High</option>
                  <option value="area_high">Area: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Filters Sidebar */}
            <div className="col-lg-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <h5 className="card-title mb-0">Filters</h5>
                  </div>
                  <PropertyFilters
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                    initialFilters={filters}
                  />
                </div>
              </div>
            </div>

            {/* Property List */}
            <div className="col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="mb-1">Properties</h4>
                  <p className="text-muted mb-0">
                    {getActiveFiltersCount() > 0 
                      ? `${getActiveFiltersCount()} filters applied` 
                      : 'Showing all properties'}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fa fa-search fa-3x text-muted mb-3"></i>
                  <h4>No Properties Found</h4>
                  <p className="text-muted mb-4">
                    Try adjusting your search criteria or browse all properties.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={handleResetFilters}
                  >
                    <i className="fa fa-refresh me-2"></i>
                    Reset Filters
                  </button>
                </div>
              ) : (
                <PropertyList 
                  properties={properties}
                  loading={loading}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  viewMode={viewMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Properties;