import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Loading from './Loading';

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;
  
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("authToken");
  
  if (!isLoggedIn) {
    // Use effect to navigate programmatically
    useEffect(() => {
      navigate('/login', { replace: true });
    }, [navigate]);
    return null;
  }
  
  // Check if user has admin role
  const isAdmin = user?.roles?.some(role => role.name === 'ROLE_ADMIN');
  
  if (!isAdmin) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }
  
  // Render children if authenticated and is admin
  return children;
};

export default AdminRoute;
