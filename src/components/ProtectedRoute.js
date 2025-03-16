import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(auth.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;