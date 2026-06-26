// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // O ajusta si usas otro método

  if (!token) {
    return <Navigate to="/loginAdmin" replace />;
  }

  return children;
};

export default ProtectedRoute;
