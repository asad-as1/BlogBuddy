import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../components/auth'; // Adjust the path as needed

const ProtectedRoute = ({ element, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = () => {
      setIsAuthenticated(isTokenValid());
    };
    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-center m-3 text-xl">Loading...</div>; 
  }

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
