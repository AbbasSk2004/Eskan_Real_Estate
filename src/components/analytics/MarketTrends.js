import React, { useState, useEffect } from 'react';
import { endpoints } from '../../services/api';

const MarketTrends = () => {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('6months');
  const [propertyType, setPropertyType] = useState('all');

  useEffect(() => {
    fetchMarketTrends();
  }, [timeframe, propertyType]);

  const fetchMarketTrends = async () => {
    try {
      setLoading(true);
      const response = await endpoints.getMarketTrends({
        timeframe,
        propertyType: propertyType !== 'all' ? propertyType : undefined
      });
      setTrends(response.data);
    } catch (error) {
      console.error('Error fetching market trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatPercentage = (value) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-success';
    if (value < 0) return 'text-danger';
    return 'text-muted';
  };

  if (loading) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading market trends...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trends) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="alert alert-info" role="alert">
            No market trend data available at the moment.
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
            <h1 className="mb-3">Market Trends</h1>
            <p className="text-muted">
              Analyze real estate market trends and price movements in Lebanon
            </p>
          </div>
          <div className="col-lg-4">
            <div className="row g-2">
              <div className="col-6">
                <select
                  className="form-select"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="3months">3 Months</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                  <option value="2years">2 Years</option>
                </select>
              </div>
              <div className="col-6">
                <select
                  className="form-select"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Apartment">Apartments</option>
                  <option value="House">Houses</option>
                  <option value="Villa">Villas</option>
                  <option value="Office">Offices</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="row g-4 mb-5">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '60px', height: '60px' }}>
                  <i className="fa fa-chart-line text-white fa-2x"></i>
                </div>
                <h4 className="text-primary">{formatPrice(trends.averagePrice)}</h4>
                <p className="mb-1">Average Price</p>
                <small className={getChangeColor(trends.priceChange)}>
                  {formatPercentage(trends.priceChange)} from last period
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '60px', height: '60px' }}>
                  <i className="fa fa-home text-white fa-2x"></i>
                </div>
                <h4 className="text-success">{trends.totalListings}</h4>
                <p className="mb-1">Total Listings</p>
                <small className={getChangeColor(trends.listingsChange)}>
                  {formatPercentage(trends.listingsChange)} from last period
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '60px', height: '60px' }}>
                  <i className="fa fa-clock text-white fa-2x"></i>
                </div>
                <h4 className="text-info">{trends.averageDaysOnMarket}</h4>
                <p className="mb-1">Avg. Days on Market</p>
                <small className={getChangeColor(-trends.daysOnMarketChange)}>
                  {formatPercentage(trends.daysOnMarketChange)} from last period
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '60px', height: '60px' }}>
                  <i className="fa fa-percentage text-white fa-2x"></i>
                </div>
                <h4 className="text-warning">{trends.saleToListRatio}%</h4>
                <p className="mb-1">Sale-to-List Ratio</p>
                <small className={getChangeColor(trends.saleToListChange)}>
                  {formatPercentage(trends.saleToListChange)} from last period
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Price Trends by Location */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Price Trends by Governorate</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Governorate</th>
                        <th>Average Price</th>
                        <th>Price Change</th>
                        <th>Total Listings</th>
                        <th>Market Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trends.locationTrends?.map((location, index) => (
                        <tr key={index}>
                          <td>
                            <strong>{location.governorate}</strong>
                          </td>
                          <td>{formatPrice(location.averagePrice)}</td>
                          <td>
                            <span className={getChangeColor(location.priceChange)}>
                              {formatPercentage(location.priceChange)}
                            </span>
                          </td>
                          <td>{location.totalListings}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                                <div 
                                  className="progress-bar bg-primary" 
                                  style={{ width: `${location.marketShare}%` }}
                                ></div>
                              </div>
                              <small>{location.marketShare}%</small>
                            </div>
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

        {/* Property Type Analysis */}
        <div className="row mb-5">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Most Popular Property Types</h5>
              </div>
              <div className="card-body">
                {trends.propertyTypeAnalysis?.map((type, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h6 className="mb-1">{type.propertyType}</h6>
                      <small className="text-muted">{type.listings} listings</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{type.percentage}%</div>
                      <div className="progress" style={{ width: '100px', height: '6px' }}>
                        <div 
                          className="progress-bar bg-primary" 
                          style={{ width: `${type.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Price Range Distribution</h5>
              </div>
              <div className="card-body">
                {trends.priceRangeDistribution?.map((range, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h6 className="mb-1">{range.range}</h6>
                      <small className="text-muted">{range.count} properties</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{range.percentage}%</div>
                      <div className="progress" style={{ width: '100px', height: '6px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${range.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">Market Insights</h5>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-lg-4">
                    <div className="text-center">
                      <i className="fa fa-trending-up fa-3x text-success mb-3"></i>
                      <h6>Growing Markets</h6>
                      <p className="text-muted small">
                        {trends.insights?.growingMarkets?.join(', ') || 'No data available'}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="text-center">
                      <i className="fa fa-fire fa-3x text-danger mb-3"></i>
                      <h6>Hot Property Types</h6>
                      <p className="text-muted small">
                        {trends.insights?.hotPropertyTypes?.join(', ') || 'No data available'}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="text-center">
                      <i className="fa fa-lightbulb fa-3x text-warning mb-3"></i>
                      <h6>Investment Opportunities</h6>
                      <p className="text-muted small">
                        {trends.insights?.investmentOpportunities?.join(', ') || 'No data available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;