import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth available to any
// child component that calls useAuth().
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const checkLoggedIn = () => {
      const loggedIn = authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        try {
          const userData = localStorage.getItem('userData');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (e) {
          console.error('Error parsing user data', e);
        }
      }
      
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  // Login function
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setIsLoggedIn(true);
    setUser(data.user || {});
    return data;
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  // Value object that will be passed to any consumer components
  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;