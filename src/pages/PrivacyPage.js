import React from 'react';
import LegalDocument from '../components/legal/LegalDocument';
import { getPageBreadcrumbs } from '../utils/pageUtils';

const PrivacyPage = () => {
  return (
    <>
      <LegalDocument type="privacy" />
    </>
  );
};

export default PrivacyPage;