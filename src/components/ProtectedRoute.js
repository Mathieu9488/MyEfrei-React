import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotFound from '../pages/NotFound';

const ProtectedRoute = ({ children, roles }) => {
  const { auth, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" />

  if (roles && !roles.includes(auth.role)) {
    console.log("Role required", auth.role);
    return <NotFound />;
  }

  return children;
};

export default ProtectedRoute;