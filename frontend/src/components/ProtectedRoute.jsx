import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookie from 'cookies-js';
import axios from 'axios';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = Cookie.get('token');

  const BACKEND_URL = import.meta.env.VITE_URL;


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}user/check-auth`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true // Add this line
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
    return <div className='text-center m-3 text-xl'>Loading...</div>; // Optional: Add a loading spinner or similar
  }

  return isAuthenticated ? Component : <Navigate to="/login" />;
};

export default ProtectedRoute;
