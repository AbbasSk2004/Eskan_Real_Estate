import React from 'react';
import LegalDocument from '../components/legal/LegalDocument';
import { getPageBreadcrumbs } from '../utils/pageUtils';

const CookiePage = () => {
  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <LegalDocument type="cookies" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePage;