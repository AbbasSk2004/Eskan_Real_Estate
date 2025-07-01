import React, { useState, useEffect } from 'react';
import { LEBANESE_GOVERNORATES, CITIES_BY_GOVERNORATE } from '../../constants/lebanonLocations';
import { getPopularSearches, getSavedSearches, saveSearch } from '../../services/searchService';
import { useAuth } from '../../context/AuthContext';

const PropertySearch = ({ filters, setFilters, onSearch, showAdvanced = true }) => {
  const { user, isAuthenticated } = useAuth();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    loadPopularSearches();
    if (isAuthenticated) {
      loadSavedSearches();
    }
  }, [isAuthenticated]);

  const loadPopularSearches = async () => {
    const searches = await getPopularSearches();
    setPopularSearches(searches);
  };

  const loadSavedSearches = async () => {
    if (!user) return;
    const searches = await getSavedSearches(user.id);
    setSavedSearches(searches);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleFeatureToggle = (feature) => {
    handleFilterChange(feature, !filters[feature]);
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      keyword: '',
      propertyType: '',
      status: 'all',
      governorate: '',
      city: '',
      priceRange: '',
      bedrooms: '',
      bathrooms: '',
      // Reset all features
      airConditioning: false,
      heating: false,
      internet: false,
      parking: false,
      swimmingPool: false,
      generator: false,
      waterTank: false,
      security: false,
      balcony: false,
      elevator: false,
      solarPanels: false,
      garden: false,
      fireplace: false,
      bbqArea: false,
      irrigation: false,
      storage: false,
      electricity: false,
      roadAccess: false,
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const handleSaveSearch = async () => {
    if (!isAuthenticated || !searchName.trim()) return;

    const success = await saveSearch(user.id, filters, searchName.trim());
    if (success) {
      setShowSaveSearch(false);
      setSearchName('');
      loadSavedSearches();
      alert('Search saved successfully!');
    } else {
      alert('Failed to save search. Please try again.');
    }
  };

  const handleLoadSavedSearch = (savedSearch) => {
    setFilters(savedSearch.search_filters);
    onSearch(savedSearch.search_filters);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'status' && value === 'all') return false;
      return value && value !== '' && value !== false;
    }).length;
  };

  return (
    <div className="property-search bg-light py-4">
      <div className="container-fluid px-4 px-lg-5">
        {/* Popular Searches */}
        {popularSearches.length > 0 && (
          <div className="row mb-3">
            <div className="col-12">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="text-muted me-2">Popular:</span>
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      handleFilterChange('keyword', search);
                      handleSearch();
                    }}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Saved Searches */}
        {isAuthenticated && savedSearches.length > 0 && (
          <div className="row mb-3">
            <div className="col-12">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="text-muted me-2">Saved:</span>
                {savedSearches.slice(0, 3).map((search) => (
                  <button
                    key={search.id}
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleLoadSavedSearch(search)}
                  >
                    <i className="fa fa-bookmark me-1"></i>
                    {search.search_name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Search Form */}
        <div className="card">
          <div className="card-body">
            <div className="row g-3">
              {/* Keyword Search */}
              <div className="col-12 col-sm-6 col-md-4">
                <label className="form-label">Search</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter keyword, location, or property ID"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="col-6 col-md-2">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="duplex">Duplex</option>
                  <option value="studio">Studio</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="chalet">Chalet</option>
                  <option value="office">Office</option>
                  <option value="shop">Shop</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="land">Land</option>
                  <option value="building">Building</option>
                </select>
              </div>

              {/* Status */}
              <div className="col-6 col-md-2">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                </select>
              </div>

              {/* Governorate */}
              <div className="col-6 col-md-2">
                <label className="form-label">Governorate</label>
                <select
                  className="form-select"
                  value={filters.governorate}
                  onChange={(e) => {
                    handleFilterChange('governorate', e.target.value);
                    handleFilterChange('city', ''); // Reset city when governorate changes
                  }}
                >
                  <option value="">All Governorates</option>
                  {Object.entries(LEBANESE_GOVERNORATES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="col-6 col-md-2">
                <label className="form-label">City</label>
                <select
                  className="form-select"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  disabled={!filters.governorate}
                >
                  <option value="">All Cities</option>
                  {filters.governorate && CITIES_BY_GOVERNORATE[filters.governorate]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
              <>
                <div className="row mt-3">
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                      <i className={`fa fa-chevron-${showAdvancedFilters ? 'up' : 'down'} me-2`}></i>
                      Advanced Filters
                      {getActiveFiltersCount() > 0 && (
                        <span className="badge bg-primary ms-2">{getActiveFiltersCount()}</span>
                      )}
                    </button>
                  </div>
                </div>

                {showAdvancedFilters && (
                  <div className="mt-3 pt-3 border-top">
                    <div className="row g-3">
                      {/* Price Range */}
                      <div className="col-12 col-sm-6 col-md-3">
                        <label className="form-label">Price Range</label>
                        <select
                          className="form-select"
                          value={filters.priceRange}
                          onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        >
                          <option value="">Any Price</option>
                          <option value="500000-1000000">$500,000 - $1,000,000</option>
                          <option value="1000000-">Over $1,000,000</option>
                        </select>
                      </div>

                      {/* Bedrooms */}
                      <div className="col-12 col-sm-6 col-md-3">
                        <label className="form-label">Min Bedrooms</label>
                        <select
                          className="form-select"
                          value={filters.bedrooms}
                          onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                        >
                          <option value="">Any</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                          <option value="4">4+</option>
                          <option value="5">5+</option>
                        </select>
                      </div>

                      {/* Bathrooms */}
                      <div className="col-12 col-sm-6 col-md-3">
                        <label className="form-label">Min Bathrooms</label>
                        <select
                          className="form-select"
                          value={filters.bathrooms}
                          onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                        >
                          <option value="">Any</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                          <option value="4">4+</option>
                        </select>
                      </div>

                      {/* Area Range */}
                      <div className="col-12 col-sm-6 col-md-3">
                        <label className="form-label">Area (m²)</label>
                        <select
                          className="form-select"
                          value={filters.areaRange}
                          onChange={(e) => handleFilterChange('areaRange', e.target.value)}
                        >
                          <option value="">Any Size</option>
                          <option value="0-100">Under 100 m²</option>
                          <option value="100-200">100 - 200 m²</option>
                          <option value="200-300">200 - 300 m²</option>
                          <option value="300-500">300 - 500 m²</option>
                          <option value="500-">Over 500 m²</option>
                        </select>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="row mt-4">
                      <div className="col-12">
                        <h6 className="mb-3">Features & Amenities</h6>
                        <div className="row g-2">
                          {/* Essential Features */}
                          <div className="col-12 col-sm-6 col-md-6">
                            <h6 className="small text-muted mb-2">Essential</h6>
                            <div className="row g-2">
                              {[
                                { key: 'parking', label: 'Parking', icon: 'fa-car' },
                                { key: 'elevator', label: 'Elevator', icon: 'fa-arrows-alt-v' },
                                { key: 'airConditioning', label: 'Air Conditioning', icon: 'fa-snowflake' },
                                { key: 'heating', label: 'Heating', icon: 'fa-fire' },
                                { key: 'internet', label: 'Internet', icon: 'fa-wifi' },
                                { key: 'security', label: 'Security', icon: 'fa-shield-alt' },
                                { key: 'generator', label: 'Generator', icon: 'fa-bolt' },
                                { key: 'waterTank', label: 'Water Tank', icon: 'fa-tint' },
                              ].map(feature => (
                                <div key={feature.key} className="col-6">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={feature.key}
                                      checked={filters[feature.key] || false}
                                      onChange={() => handleFeatureToggle(feature.key)}
                                    />
                                    <label className="form-check-label small" htmlFor={feature.key}>
                                      <i className={`fa ${feature.icon} me-1`}></i>
                                      {feature.label}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Luxury Features */}
                          <div className="col-12 col-sm-6 col-md-6">
                            <h6 className="small text-muted mb-2">Luxury & Comfort</h6>
                            <div className="row g-2">
                              {[
                                { key: 'swimmingPool', label: 'Swimming Pool', icon: 'fa-swimmer' },
                                { key: 'garden', label: 'Garden', icon: 'fa-leaf' },
                                { key: 'balcony', label: 'Balcony', icon: 'fa-building' },
                                { key: 'solarPanels', label: 'Solar Panels', icon: 'fa-solar-panel' },
                                { key: 'fireplace', label: 'Fireplace', icon: 'fa-fire' },
                                { key: 'bbqArea', label: 'BBQ Area', icon: 'fa-utensils' },
                                { key: 'storage', label: 'Storage', icon: 'fa-box' },
                                { key: 'irrigation', label: 'Irrigation', icon: 'fa-tint' },
                              ].map(feature => (
                                <div key={feature.key} className="col-6">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={feature.key}
                                      checked={filters[feature.key] || false}
                                      onChange={() => handleFeatureToggle(feature.key)}
                                    />
                                    <label className="form-check-label small" htmlFor={feature.key}>
                                      <i className={`fa ${feature.icon} me-1`}></i>
                                      {feature.label}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location Features */}
                    <div className="row mt-4">
                      <div className="col-12">
                        <h6 className="mb-3">Location Preferences</h6>
                        <div className="row g-2">
                          {[
                            { key: 'near_seafront', label: 'Near Seafront', icon: 'fa-water' },
                            { key: 'near_mountains', label: 'Near Mountains', icon: 'fa-mountain' },
                            { key: 'near_schools', label: 'Near Schools', icon: 'fa-school' },
                            { key: 'near_hospitals', label: 'Near Hospitals', icon: 'fa-hospital' },
                            { key: 'near_malls', label: 'Near Malls', icon: 'fa-shopping-bag' },
                            { key: 'near_public_transport', label: 'Near Public Transport', icon: 'fa-bus' },
                          ].map(feature => (
                            <div key={feature.key} className="col-12 col-sm-6 col-md-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={feature.key}
                                  checked={filters[feature.key] || false}
                                  onChange={() => handleFeatureToggle(feature.key)}
                                />
                                <label className="form-check-label small" htmlFor={feature.key}>
                                  <i className={`fa ${feature.icon} me-1`}></i>
                                  {feature.label}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSearch}
                  >
                    <i className="fa fa-search me-2"></i>
                    Search Properties
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleReset}
                  >
                    <i className="fa fa-refresh me-2"></i>
                    Reset
                  </button>

                  {isAuthenticated && getActiveFiltersCount() > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setShowSaveSearch(true)}
                    >
                      <i className="fa fa-bookmark me-2"></i>
                      Save Search
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Search Modal */}
        {showSaveSearch && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title">Save Search</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowSaveSearch(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Search Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Apartments in Beirut"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      maxLength={50}
                    />
                    <div className="form-text">
                      Give your search a memorable name
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowSaveSearch(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveSearch}
                    disabled={!searchName.trim()}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertySearch;