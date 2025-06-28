import React, { createContext, useContext } from 'react';
import { useApiConnection } from '../hooks/useApiConnection';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const apiConnection = useApiConnection();

  return (
    <ApiContext.Provider value={apiConnection}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}; 