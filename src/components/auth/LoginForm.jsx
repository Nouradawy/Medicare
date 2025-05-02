import { useState } from 'react';
import './LoginForm.css';
import authService from '../../services/authService';

const LoginForm = ({ onLoginSuccess, onLogin }) => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the onLogin function from AuthContext if provided, otherwise use authService
      const response = onLogin 
        ? await onLogin(formData) 
        : await authService.login(formData);
      
      // Call the onLoginSuccess callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(response);
      }
      
      // Redirect logic can be added here or handled by the parent component
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
      
      <div className="login-footer">
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
        <p><a href="/forgot-password">Forgot password?</a></p>
      </div>
    </div>
  );
};

export default LoginForm;