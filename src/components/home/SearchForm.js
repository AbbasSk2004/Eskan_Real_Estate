import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROPERTY_TYPES } from '../../utils/propertyTypes';
import { PROPERTY_TYPE_FIELDS } from '../../utils/propertyTypeFields';

const DEFAULT_FILTERS = {
  keyword: '',
  propertyType: '',
  priceRange: 0,
  bedrooms: '',
  bathrooms: '',
};

const SearchForm = ({ onFilter, initialFilters = {} }) => {
  const [keyword, setKeyword] = useState(initialFilters.keyword || '');
  const [propertyType, setPropertyType] = useState(initialFilters.propertyType || '');
  const [priceRange, setPriceRange] = useState(
    initialFilters.priceRange !== undefined ? Number(initialFilters.priceRange) : 0
  );
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms || '');
  const [bathrooms, setBathrooms] = useState(initialFilters.bathrooms || '');
  const [extra, setExtra] = useState(() => {
    // Only keep extra fields that are not the main ones
    const { keyword, propertyType, priceRange, bedrooms, bathrooms, ...rest } = initialFilters;
    return rest;
  });
  const navigate = useNavigate();

  // Prevent infinite loop: only update state if initialFilters actually changed
  useEffect(() => {
    if (
      keyword !== (initialFilters.keyword || '') ||
      propertyType !== (initialFilters.propertyType || '') ||
      priceRange !== (initialFilters.priceRange !== undefined ? Number(initialFilters.priceRange) : 0) ||
      bedrooms !== (initialFilters.bedrooms || '') ||
      bathrooms !== (initialFilters.bathrooms || '')
    ) {
      setKeyword(initialFilters.keyword || '');
      setPropertyType(initialFilters.propertyType || '');
      setPriceRange(
        initialFilters.priceRange !== undefined ? Number(initialFilters.priceRange) : 0
      );
      setBedrooms(initialFilters.bedrooms || '');
      setBathrooms(initialFilters.bathrooms || '');
      const { keyword, propertyType, priceRange, bedrooms, bathrooms, ...rest } = initialFilters;
      setExtra(rest);
    }
    // eslint-disable-next-line
  }, [initialFilters]);

  // Get current property type configuration
  const typeConfig = propertyType ? PROPERTY_TYPE_FIELDS[propertyType] || { details: [] } : { details: [] };

  // Reset extra fields when property type changes
  useEffect(() => {
    setExtra({});
  }, [propertyType]);

  // Compose filters object
  const filters = {
    keyword,
    propertyType,
    priceRange,
    bedrooms,
    bathrooms,
    ...extra
  };

  // Only call onFilter if filters actually changed (user input)
  const prevFilters = useRef(filters);
  useEffect(() => {
    if (JSON.stringify(prevFilters.current) !== JSON.stringify(filters)) {
      if (onFilter) onFilter(filters);

      // If any filter is used, navigate to /properties with query params
      const hasFilter =
        keyword !== '' ||
        propertyType !== '' ||
        priceRange > 0 ||
        bedrooms !== '' ||
        bathrooms !== '' ||
        Object.values(extra).some(v => v !== '' && v !== undefined);

      if (hasFilter && window.location.pathname === '/') {
        const params = new URLSearchParams(filters).toString();
        navigate(`/properties?${params}`);
      }
      prevFilters.current = filters;
    }
    // eslint-disable-next-line
  }, [keyword, propertyType, priceRange, bedrooms, bathrooms, extra]);

  const handleExtraChange = (e) => {
    setExtra({ ...extra, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setKeyword('');
    setPropertyType('');
    setPriceRange(0);
    setBedrooms('');
    setBathrooms('');
    setExtra({});
    if (onFilter) onFilter(DEFAULT_FILTERS);
  };

  return (
    <div className="container-fluid bg-primary mb-5 wow fadeIn" data-wow-delay="0.1s" style={{ padding: '35px' }}>
      <div className="container">
        <form onSubmit={e => e.preventDefault()}>
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control border-0 py-3"
                placeholder="Search Keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select border-0 py-3"
                value={propertyType}
                onChange={(e) => {
                  setPropertyType(e.target.value);
                  setExtra({});
                }}
              >
                <option value="">Property Type</option>
                {PROPERTY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select border-0 py-3"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <option value="">Bedrooms</option>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select border-0 py-3"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              >
                <option value="">Bathrooms</option>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <div className="price-range-wrapper">
                <label className="text-white mb-1">Price Up To: ${priceRange.toLocaleString()}</label>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="90000000"
                  step="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
          {/* Extra filters for selected property type */}
          {propertyType && typeConfig.details && typeConfig.details.length > 0 && (
            <div className="row g-3 mt-2">
              {typeConfig.details.map(detail => (
                <div className="col-md-3" key={detail.name}>
                  {detail.type === 'select' && Array.isArray(detail.options) ? (
                    <select
                      className="form-select border-0 py-3"
                      name={detail.name}
                      value={extra[detail.name] || ''}
                      onChange={handleExtraChange}
                    >
                      <option value="">{detail.label}</option>
                      {detail.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={detail.type}
                      className="form-control border-0 py-3"
                      name={detail.name}
                      placeholder={detail.label}
                      value={extra[detail.name] || ''}
                      onChange={handleExtraChange}
                      min={detail.min}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="row mt-3">
            <div className="col-12 d-flex justify-content-end">
              {(
                keyword !== '' ||
                propertyType !== '' ||
                priceRange > 0 ||
                bedrooms !== '' ||
                bathrooms !== '' ||
                Object.values(extra).some(v => v !== '' && v !== undefined)
              ) && (
                <button
                  type="button"
                  className="btn"
                  style={{
                    backgroundColor: '#28a745',
                    color: '#fff',
                    padding: '12px 32px',
                    borderRadius: '6px',
                    fontWeight: 500,
                    border: 'none'
                  }}
                  onClick={handleReset}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
