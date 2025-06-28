import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LegalDocument from './LegalDocument';
import Layout from '../layout/Layout';
import { getPageBreadcrumbs } from '../layout/Header';

const LegalRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/terms" 
        element={
          <Layout
            showHeader={true}
            headerTitle="Terms and Conditions"
            headerBreadcrumbs={[{ label: 'Legal', path: '/legal' }, { label: 'Terms and Conditions', path: '/legal/terms' }]}
          >
            <LegalDocument type="terms" />
          </Layout>
        } 
      />
      <Route 
        path="/privacy" 
        element={
          <Layout
            showHeader={true}
            headerTitle="Privacy Policy"
            headerBreadcrumbs={[{ label: 'Legal', path: '/legal' }, { label: 'Privacy Policy', path: '/legal/privacy' }]}
          >
            <LegalDocument type="privacy" />
          </Layout>
        } 
      />
      <Route 
        path="/cookies" 
        element={
          <Layout
            showHeader={true}
            headerTitle="Cookie Policy"
            headerBreadcrumbs={[{ label: 'Legal', path: '/legal' }, { label: 'Cookie Policy', path: '/legal/cookies' }]}
          >
            <LegalDocument type="cookies" />
          </Layout>
        } 
      />
      <Route 
        path="/" 
        element={
          <Layout
            showHeader={true}
            headerTitle="Legal Information"
            headerBreadcrumbs={[{ label: 'Legal', path: '/legal' }]}
          >
            <LegalHub />
          </Layout>
        } 
      />
    </Routes>
  );
};

// Legal Hub component - overview of all legal documents
const LegalHub = () => {
  const legalDocuments = [
    {
      title: 'Terms and Conditions',
      description: 'Our terms of service and user agreement for using our platform.',
      icon: 'fa-file-contract',
      path: '/legal/terms',
      color: 'primary'
    },
    {
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your personal information.',
      icon: 'fa-shield-alt',
      path: '/legal/privacy',
      color: 'success'
    },
    {
      title: 'Cookie Policy',
      description: 'Information about how we use cookies and similar technologies.',
      icon: 'fa-cookie-bite',
      path: '/legal/cookies',
      color: 'warning'
    }
  ];

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
          <h1 className="mb-3">Legal Information</h1>
          <p className="text-muted">
            Find all our legal documents and policies in one place. We believe in transparency 
            and want you to understand how we operate.
          </p>
        </div>

        <div className="row g-4">
          {legalDocuments.map((doc, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="legal-card h-100 bg-white rounded shadow-sm p-4 text-center">
                <div className={`icon mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle bg-${doc.color}`} 
                     style={{ width: '80px', height: '80px' }}>
                  <i className={`fa ${doc.icon} fa-2x text-white`}></i>
                </div>
                <h5 className="mb-3">{doc.title}</h5>
                <p className="text-muted mb-4">{doc.description}</p>
                <div className="mt-auto">
                  <a href={doc.path} className={`btn btn-${doc.color} w-100`}>
                    <i className="fa fa-eye me-2"></i>
                    Read Document
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="bg-light rounded p-5">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h4 className="text-primary mb-3">Need Help Understanding Our Policies?</h4>
                  <p className="mb-0">
                    Our legal documents are written to be as clear as possible, but if you have 
                    any questions or need clarification on any of our policies, please don't 
                    hesitate to contact our support team.
                  </p>
                </div>
                <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                  <a href="/contact" className="btn btn-primary">
                    <i className="fa fa-envelope me-2"></i>
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated Information */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="alert alert-info">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <i className="fa fa-info-circle me-2"></i>
                  <strong>Last Updated:</strong> All legal documents were last updated on January 15, 2024
                </div>
                <div className="col-md-4 text-md-end">
                  <small className="text-muted">Version 2.1</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalRoutes;