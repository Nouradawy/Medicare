import { Navigate } from 'react-router-dom';
import {useAuth } from '../../context/AuthContext' 
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  
  // Show loading indicator while checking authentication status
  if (loading) {
    return <Loading />;
  }
  
  if (!isLoggedIn) {
    // Use effect to navigate programmatically
    useEffect(() => {
      navigate('/login', { replace: true });
    }, [navigate]);
    return null;
  }
  
  // Render children if authenticated
  return children;
};

export default ProtectedRoute;