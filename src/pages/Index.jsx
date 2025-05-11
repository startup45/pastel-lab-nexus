
import React, { useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';

const Index = () => {
  const { navigate } = useNavigation();
  
  useEffect(() => {
    navigate('login');
  }, [navigate]);
  
  return <div className="loading">Redirecting...</div>;
};

export default Index;
