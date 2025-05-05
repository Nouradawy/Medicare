import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import APICalls  from '../services/APICalls';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  
  useEffect( () => {
    // Redirect to dashboard if user is already logged in
    if (isLoggedIn) {
     // APICalls.GetCurrentUser();
      navigate('/dashboard');
    } else {
      // Optionally, you can set a default state or perform other actions
      console.log('User is not logged in');
    }
  }, [isLoggedIn, navigate]);

  const handleLoginSuccess = () => {
    // Redirect to dashboard after successful login

    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login with your username and password</p>
        </div>
        <LoginForm onLoginSuccess={handleLoginSuccess} onLogin={login} />
      </div>
    </div>
  );
};

export default Login;