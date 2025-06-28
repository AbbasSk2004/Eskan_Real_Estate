import React, { useState, useEffect } from 'react';
import { endpoints } from '../../services/api';

const UserPreferences = () => {
  const [preferences, setPreferences] = useState({
    preferred_property_types: [],
    preferred_locations: { cities: [], governorates: [] },
    price_range: { min: 0, max: 1000000 },
    notification_settings: {
      email_alerts: true,
      sms_alerts: false,
      new_listings: true,
      price_changes: false
    },
    search_alerts: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const propertyTypes = [
    'Apartment', 'House', 'Villa', 'Office', 'Shop', 'Warehouse', 
    'Land', 'Farm', 'Building', 'Studio'
  ];

  const governorates = [
    'Beirut', 'Mount Lebanon', 'North Lebanon', 'South Lebanon', 
    'Bekaa', 'Nabatieh', 'Akkar', 'Baalbek-Hermel'
  ];

  const cities = [
    'Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Jounieh', 'Zahlé', 
    'Baalbek', 'Nabatieh', 'Byblos', 'Anjar'
  ];

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await endpoints.getUserPreferences();
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setMessage('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await endpoints.updateUserPreferences(preferences);
      setMessage('Preferences saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handlePropertyTypeChange = (type) => {
    setPreferences(prev => ({
      ...prev,
      preferred_property_types: prev.preferred_property_types.includes(type)
        ? prev.preferred_property_types.filter(t => t !== type)
        : [...prev.preferred_property_types, type]
    }));
  };

  const handleLocationChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      preferred_locations: {
        ...prev.preferred_locations,
        [type]: prev.preferred_locations[type].includes(value)
          ? prev.preferred_locations[type].filter(item => item !== value)
          : [...prev.preferred_locations[type], value]
      }
    }));
  };

  const handlePriceRangeChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      price_range: {
        ...prev.price_range,
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleNotificationChange = (setting) => {
    setPreferences(prev => ({
      ...prev,
      notification_settings: {
        ...prev.notification_settings,
        [setting]: !prev.notification_settings[setting]
      }
    }));
  };

  if (loading) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card border-0 shadow">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <i className="fa fa-cog me-2"></i>User Preferences
                </h4>
              </div>
              <div className="card-body p-4">
                {message && (
                  <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`} role="alert">
                    {message}
                  </div>
                )}

                {/* Property Types */}
                <div className="mb-4">
                  <h5 className="mb-3">Preferred Property Types</h5>
                  <div className="row g-2">
                    {propertyTypes.map(type => (
                      <div key={type} className="col-md-4 col-sm-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`type-${type}`}
                            checked={preferences.preferred_property_types.includes(type)}
                            onChange={() => handlePropertyTypeChange(type)}
                          />
                          <label className="form-check-label" htmlFor={`type-${type}`}>
                            {type}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Locations */}
                <div className="mb-4">
                  <h5 className="mb-3">Preferred Locations</h5>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Governorates</h6>
                      {governorates.map(gov => (
                        <div key={gov} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`gov-${gov}`}
                            checked={preferences.preferred_locations.governorates.includes(gov)}
                            onChange={() => handleLocationChange('governorates', gov)}
                          />
                          <label className="form-check-label" htmlFor={`gov-${gov}`}>
                            {gov}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="col-md-6">
                      <h6>Cities</h6>
                      {cities.map(city => (
                        <div key={city} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`city-${city}`}
                            checked={preferences.preferred_locations.cities.includes(city)}
                            onChange={() => handleLocationChange('cities', city)}
                          />
                          <label className="form-check-label" htmlFor={`city-${city}`}>
                            {city}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <h5 className="mb-3">Price Range</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="minPrice" className="form-label">Minimum Price ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="minPrice"
                        value={preferences.price_range.min}
                        onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                        min="0"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="maxPrice" className="form-label">Maximum Price ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="maxPrice"
                        value={preferences.price_range.max}
                        onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      Current range: ${preferences.price_range.min.toLocaleString()} - ${preferences.price_range.max.toLocaleString()}
                    </small>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="mb-4">
                  <h5 className="mb-3">Notification Settings</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="emailAlerts"
                          checked={preferences.notification_settings.email_alerts}
                          onChange={() => handleNotificationChange('email_alerts')}
                        />
                        <label className="form-check-label" htmlFor="emailAlerts">
                          Email Alerts
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="smsAlerts"
                          checked={preferences.notification_settings.sms_alerts}
                          onChange={() => handleNotificationChange('sms_alerts')}
                        />
                        <label className="form-check-label" htmlFor="smsAlerts">
                          SMS Alerts
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="newListings"
                          checked={preferences.notification_settings.new_listings}
                          onChange={() => handleNotificationChange('new_listings')}
                        />
                        <label className="form-check-label" htmlFor="newListings">
                          New Listings
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="priceChanges"
                          checked={preferences.notification_settings.price_changes}
                          onChange={() => handleNotificationChange('price_changes')}
                        />
                        <label className="form-check-label" htmlFor="priceChanges">
                          Price Changes
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Alerts */}
                <div className="mb-4">
                  <h5 className="mb-3">Search Alerts</h5>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="searchAlerts"
                      checked={preferences.search_alerts}
                      onChange={() => setPreferences(prev => ({ ...prev, search_alerts: !prev.search_alerts }))}
                    />
                    <label className="form-check-label" htmlFor="searchAlerts">
                      Enable search alerts for matching properties
                    </label>
                  </div>
                  <small className="text-muted">
                    Get notified when new properties match your search criteria
                  </small>
                </div>

                {/* Save Button */}
                <div className="d-grid">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-save me-2"></i>Save Preferences
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};export default UserPreferences;