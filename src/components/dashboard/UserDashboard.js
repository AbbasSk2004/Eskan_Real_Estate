import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { endpoints } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await endpoints.getUserDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const { stats, recentActivity } = dashboardData;

  return (
    <div className="container-xxl py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-5">
          <div className="col-12">
            <h1 className="mb-3">Welcome back, {currentUser?.first_name}!</h1>
            <p className="text-muted">Here's an overview of your real estate activity</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-5">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <i className="fa fa-home text-white fa-2x"></i>
                </div>
                <h3 className="text-primary">{stats.totalProperties}</h3>
                <p className="mb-0">Properties Listed</p>
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
                <h3 className="text-success">{stats.totalViews}</h3>
                <p className="mb-0">Total Views</p>
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
                <h3 className="text-info">{stats.totalInquiries}</h3>
                <p className="mb-0">Inquiries Received</p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <i className="fa fa-heart text-white fa-2x"></i>
                </div>
                <h3 className="text-warning">{stats.totalFavorites}</h3>
                <p className="mb-0">Favorites</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="mb-4">Quick Actions</h3>
            <div className="row g-3">
              <div className="col-lg-3 col-md-6">
                <Link to="/add-property" className="btn btn-primary w-100 py-3">
                  <i className="fa fa-plus me-2"></i>Add New Property
                </Link>
              </div>
              <div className="col-lg-3 col-md-6">
                <Link to="/favorites" className="btn btn-outline-primary w-100 py-3">
                  <i className="fa fa-heart me-2"></i>View Favorites
                </Link>
              </div>
              <div className="col-lg-3 col-md-6">
                <Link to="/inquiries" className="btn btn-outline-primary w-100 py-3">
                  <i className="fa fa-envelope me-2"></i>Manage Inquiries
                </Link>
              </div>
              <div className="col-lg-3 col-md-6">
                <Link to="/preferences" className="btn btn-outline-primary w-100 py-3">
                  <i className="fa fa-cog me-2"></i>Preferences
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Recent Activity</h5>
              </div>
              <div className="card-body">
                {recentActivity && recentActivity.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="list-group-item border-0 px-0">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <div className={`rounded-circle d-flex align-items-center justify-content-center ${getActivityIconClass(activity.type)}`} 
                                 style={{ width: '40px', height: '40px' }}>
                              <i className={`fa ${getActivityIcon(activity.type)} text-white`}></i>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">{activity.title}</h6>
                            <p className="mb-1 text-muted">{activity.description}</p>
                            <small className="text-muted">{formatDate(activity.created_at)}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fa fa-clock fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Property Performance</h5>
              </div>
              <div className="card-body">
                {stats.topPerformingProperty ? (
                  <div>
                    <h6 className="text-primary">{stats.topPerformingProperty.title}</h6>
                    <p className="text-muted mb-2">{stats.topPerformingProperty.views} views</p>
                    <div className="progress mb-3">
                      <div className="progress-bar" role="progressbar" 
                           style={{ width: '75%' }} 
                           aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                      </div>
                    </div>
                    <Link to={`/property/${stats.topPerformingProperty.id}`} 
                          className="btn btn-sm btn-outline-primary">
                      View Property
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fa fa-chart-line fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No performance data yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getActivityIconClass = (type) => {
  switch (type) {
    case 'property_added': return 'bg-success';
    case 'inquiry_received': return 'bg-info';
    case 'property_viewed': return 'bg-primary';
    case 'favorite_added': return 'bg-warning';
    default: return 'bg-secondary';
  }
};

const getActivityIcon = (type) => {
  switch (type) {
    case 'property_added': return 'fa-plus';
    case 'inquiry_received': return 'fa-envelope';
    case 'property_viewed': return 'fa-eye';
    case 'favorite_added': return 'fa-heart';
    default: return 'fa-bell';
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

export default UserDashboard;