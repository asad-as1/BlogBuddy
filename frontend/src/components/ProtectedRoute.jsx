import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookie from 'cookies-js';
import axios from 'axios';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = Cookie.get('token');
  const BACKEND_URL = import.meta.env.VITE_URL;

  // Capture the current location
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}user/check-auth`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true, // Include credentials if needed
        });
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    if (token) {
      checkAuth();
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  if (isAuthenticated === null) {
    return <div className='text-center m-3 text-xl'>Loading...</div>; // Optional: Loading spinner
  }

  // If not authenticated, redirect to login with the current location passed as state
  return isAuthenticated ? Component : <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoute;