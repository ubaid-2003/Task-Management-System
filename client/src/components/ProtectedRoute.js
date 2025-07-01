import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="pt-20 text-center">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.email !== 'admin@gmail.com') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
