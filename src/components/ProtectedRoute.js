import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { auth, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Attends le chargement
  if (!auth) return <Navigate to="/login" />

  if (roles && !roles.includes(auth.role)) {
    console.log("Role required", auth.role);
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;