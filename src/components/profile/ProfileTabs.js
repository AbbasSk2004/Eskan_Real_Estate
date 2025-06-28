import React from 'react';

const ProfileTabs = ({ 
  activeTab, 
  setActiveTab, 
  userProperties, 
  favorites, 
  agentApplication 
}) => {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <ul className="nav nav-pills nav-fill">
          <li className="nav-item">
            <button 
              className={`nav-link custom-nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fa fa-chart-line me-2"></i>
              Overview
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link custom-nav-link ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              <i className="fa fa-home me-2"></i>
              My Properties
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link custom-nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <i className="fa fa-heart me-2"></i>
              Favorites
            </button>
          </li>
          {agentApplication && (
            <li className="nav-item">
              <button 
                className={`nav-link custom-nav-link ${activeTab === 'agent' ? 'active' : ''}`}
                onClick={() => setActiveTab('agent')}
              >
                <i className="fa fa-user-tie me-2"></i>
                Agent Status
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfileTabs;
