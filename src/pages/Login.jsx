import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = ({setLoginForm}) => {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  
  useEffect( () => {
    // Redirect to dashboard if user is already logged in
    if (isLoggedIn) {
      if(location.pathname === '/login'){
        navigate('/dashboard');
      }
      setLoginForm(false);

    } else {
      // Optionally, you can set a default state or perform other actions
      console.log('User is not logged in');
    }
  }, [isLoggedIn, navigate, location.pathname]);

  const handleLoginSuccess = () => {
    // Redirect to dashboard after successful login

     navigate('/settings');
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-header">
          {/*<h1>Welcome Back</h1>*/}
          {/*<p>Login with your username and password</p>*/}
        </div>
        <LoginForm onLoginSuccess={handleLoginSuccess} onLogin={login} />
      </div>
    </div>
  );
};

export default Login;