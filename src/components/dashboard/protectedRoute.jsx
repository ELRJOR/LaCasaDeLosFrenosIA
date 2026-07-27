// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const BASE_URL = "https://lacasadelosfrenos-api.onrender.com";

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'authenticated' | 'unauthenticated'

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/me`, {
          credentials: 'include', // manda la cookie automáticamente
        });

        if (res.ok) {
          setStatus('authenticated');
          return;
        }

        // Access token vencido, intenta renovar antes de rendirse
        const refreshRes = await fetch(`${BASE_URL}/admin/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        setStatus(refreshRes.ok ? 'authenticated' : 'unauthenticated');
      } catch {
        setStatus('unauthenticated');
      }
    };

    checkSession();
  }, []);

  if (status === 'checking') {
    return <div>Cargando...</div>; // o tu spinner/loader existente si ya tienen uno
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/loginAdmin" replace />;
  }

  return children;
};

export default ProtectedRoute;