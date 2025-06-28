import React from 'react';
import LegalDocument from '../components/legal/LegalDocument';
import { getPageBreadcrumbs } from '../utils/pageUtils';

const TermsPage = () => {
  return (
    <>
      <LegalDocument type="terms" />
    </>
  );
};

export default TermsPage;