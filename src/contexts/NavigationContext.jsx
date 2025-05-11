
import React, { createContext, useState, useContext, useCallback } from 'react';

// Create the navigation context
const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('login');
  const [pageParams, setPageParams] = useState({});

  const navigate = useCallback((page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    
    // Update URL for bookmarking without page reload
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
  }, []);

  return (
    <NavigationContext.Provider value={{ currentPage, pageParams, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
