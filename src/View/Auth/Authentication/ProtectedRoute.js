import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, userLogin }) => {
  if (!userLogin) {
    return <Navigate to='/' />;
  }
  return children;
};
export default ProtectedRoute;
