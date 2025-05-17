import { useState, useEffect } from 'react';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = ({setLoginForm}) => {
  const { isLoggedIn, login } = useAuth();




  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-header">
          {/*<h1>Welcome Back</h1>*/}
          {/*<p>Login with your username and password</p>*/}
        </div>
        <LoginForm onLogin={login} />
      </div>
    </div>
  );
};

export default Login;