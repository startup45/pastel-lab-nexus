
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  return <Navigate to="/login" replace />;
};

export default Index;
