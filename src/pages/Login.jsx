import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = ({setLoginForm}) => {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();


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