import React, { useState, useEffect } from 'react';
import { endpoints } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PropertyStatistics = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30days');

  useEffect(() => {
    fetchStatistics();
  }, [timeframe]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await endpoints.getPropertyStatistics({
        timeframe,
        userId: currentUser?.id
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-danger';
    return 'text-muted';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return 'fa-arrow-up';
    if (change < 0) return 'fa-arrow-down';
    return 'fa-minus';
  };

  if (loading) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="alert alert-info" role="alert">
            No statistics data available.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-lg-8">
            <h1 className="mb-3">Property Statistics</h1>
            <p className="text-muted">Overview of property market performance and trends</p>
          </div>
          <div className="col-lg-4">
            <select
              className="form-select"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 3 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="row g-4 mb-5">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '60px', height: '60px' }}>
                  <i className="fa fa-home text-white fa-2x"></i>
                </div>
                <h3 className="text-primary mb-1">{formatNumber(stats.totalProperties)}</h3>
                <p className="mb-1">Total Properties</p>
                <small className={getChangeColor(stats.propertiesChange)}>
                  <i className={`fa ${getChangeIcon(stats.propertiesChange)} me-1`}></i>
                  {Math.abs(stats.propertiesChange)}% from last period
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '60px', height: '60px' }}>
                  <i className="fa fa-eye text-white fa-2x"></i>
                </div>
                <h3 className="text-success mb-1">{formatNumber(stats.totalViews)}</h3>
                <p className="mb-1">Total Views</p>
                <small className={getChangeColor(stats.viewsChange)}>
                  <i className={`fa ${getChangeIcon(stats.viewsChange)} me-1`}></i>
                  {Math.abs(stats.viewsChange)}% from last period
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '60px', height: '60px' }}>
                  <i className="fa fa-envelope text-white fa-2x"></i>
                </div>
                <h3 className="text-info mb-1">{formatNumber(stats.totalInquiries)}</h3>
                <p className="mb-1">Inquiries</p>
                <small className={getChangeColor(stats.inquiriesChange)}>
                  <i className={`fa ${getChangeIcon(stats.inquiriesChange)} me-1`}></i>
                  {Math.abs(stats.inquiriesChange)}% from last period
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '60px', height: '60px' }}>
                  <i className="fa fa-dollar-sign text-white fa-2x"></i>
                </div>
                <h3 className="text-warning mb-1">${formatNumber(stats.averagePrice)}</h3>
                <p className="mb-1">Average Price</p>
                <small className={getChangeColor(stats.priceChange)}>
                  <i className={`fa ${getChangeIcon(stats.priceChange)} me-1`}></i>
                  {Math.abs(stats.priceChange)}% from last period
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="row g-4 mb-5">
          {/* Property Types Distribution */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Property Types Distribution</h5>
              </div>
              <div className="card-body">
                {stats.propertyTypes?.map((type, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-3"
                        style={{ 
                          width: '12px', 
                          height: '12px', 
                          backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                        }}
                      ></div>
                      <span>{type.name}</span>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{type.count}</div>
                      <small className="text-muted">{type.percentage}%</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Ranges */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Price Range Distribution</h5>
              </div>
              <div className="card-body">
                {stats.priceRanges?.map((range, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small">{range.label}</span>
                      <span className="small fw-bold">{range.count} ({range.percentage}%)</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-primary" 
                        style={{ width: `${range.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location Performance */}
        <div className="row g-4 mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Top Performing Locations</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Location</th>
                        <th>Properties</th>
                        <th>Avg. Price</th>
                        <th>Total Views</th>
                        <th>Inquiries</th>
                        <th>Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topLocations?.map((location, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <strong>{location.city}</strong>
                              <br />
                              <small className="text-muted">{location.governorate}</small>
                            </div>
                          </td>
                          <td>{location.propertyCount}</td>
                          <td>${formatNumber(location.averagePrice)}</td>
                          <td>{formatNumber(location.totalViews)}</td>
                          <td>{location.inquiries}</td>
                          <td>
                            <span className={`badge ${location.conversionRate > 5 ? 'bg-success' : location.conversionRate > 2 ? 'bg-warning' : 'bg-secondary'}`}>
                              {location.conversionRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Recent Property Activity</h5>
              </div>
              <div className="card-body">
                <div className="timeline">
                  {stats.recentActivity?.map((activity, index) => (
                    <div key={index} className="timeline-item d-flex mb-3">
                      <div className="timeline-marker">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                          activity.type === 'new' ? 'bg-success' :
                          activity.type === 'view' ? 'bg-info' :
                          activity.type === 'inquiry' ? 'bg-warning' : 'bg-secondary'
                        }`} style={{ width: '32px', height: '32px' }}>
                          <i className={`fa ${
                            activity.type === 'new' ? 'fa-plus' :
                            activity.type === 'view' ? 'fa-eye' :
                            activity.type === 'inquiry' ? 'fa-envelope' : 'fa-edit'
                          } text-white fa-sm`}></i>
                        </div>
                      </div>
                      <div className="timeline-content ms-3 flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-1">{activity.title}</h6>
                          <small className="text-muted">{activity.timeAgo}</small>
                        </div>
                        <p className="mb-0 text-muted small">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Quick Stats</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <h4 className="text-primary mb-1">{stats.activeListings}</h4>
                      <small className="text-muted">Active Listings</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <h4 className="text-success mb-1">{stats.soldProperties}</h4>
                      <small className="text-muted">Sold</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <h4 className="text-info mb-1">{stats.rentedProperties}</h4>
                      <small className="text-muted">Rented</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <h4 className="text-warning mb-1">{stats.pendingProperties}</h4>
                      <small className="text-muted">Pending</small>
                    </div>
                  </div>
                </div>

                <hr />

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Profile Completion</small>
                    <small>{stats.profileCompletion}%</small>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-primary" 
                      style={{ width: `${stats.profileCompletion}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Response Rate</small>
                    <small>{stats.responseRate}%</small>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${stats.responseRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="d-grid">
                  <button className="btn btn-primary btn-sm">
                    View Detailed Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyStatistics;