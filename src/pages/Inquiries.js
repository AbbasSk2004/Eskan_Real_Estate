import React, { useState } from 'react';
import InquiriesList from '../components/inquiries/InquiriesList';

const Inquiries = () => {
  const [activeTab, setActiveTab] = useState('received');

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
          <h1 className="mb-3">Property Inquiries</h1>
          <p>Manage your property inquiries and communications with potential buyers or tenants.</p>
        </div>

        <div className="row">
          <div className="col-12">
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'received' ? 'active' : ''}`}
                  onClick={() => setActiveTab('received')}
                >
                  Received Inquiries
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'sent' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sent')}
                >
                  Sent Inquiries
                </button>
              </li>
            </ul>

            <InquiriesList type={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquiries; 