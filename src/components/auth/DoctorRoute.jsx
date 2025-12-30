import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const DoctorRoute = ({ children }) => {
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;
  
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("authToken");
  
  if (!isLoggedIn) {
    useEffect(() => {
      navigate('/login', { replace: true });
    }, [navigate]);
    return null;
  }
  
  // Check if user has doctor role
  const isDoctor = user?.roles?.some(role => role.name === 'ROLE_DOCTOR');
  
  if (!isDoctor) {
    // Redirect to home if not doctor
    return <Navigate to="/" replace />;
  }
  
  // Render children if authenticated and is doctor
  return children;
};

export default DoctorRoute;
