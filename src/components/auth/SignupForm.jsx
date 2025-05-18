import React, { useState } from 'react';
import {useNavigate, Link, redirect} from 'react-router-dom';
import './SignupForm.css';
import authService from '../../services/authService';
import {City} from "../../Constants/constant.jsx";
// Adjust the import path as necessary


const SignupForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
      userName: '',
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      gender: 'male',
      dateOfBirth: '',
      address: '',
      cityId: 1,
      age: '',
      role: ['User']
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
  
    const handleRoleChange = (e) => {
      setFormData({
        ...formData,
        role: [e.target.value]
      });
    };
  
    const validateForm = () => {
      if (!formData.userName || !formData.email || !formData.fullName || !formData.password) {
        setError('Please fill in all required fields');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      
      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      
      return true;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      // Create payload - remove confirmPassword as it's not required by API
      const payload = {...formData};
      delete payload.confirmPassword;
      
      // Prepare data for API (remove confirmPassword as it's not needed in the API)
    const apiData = { ...formData };
    delete apiData.confirmPassword;

    try {
      const data = await authService.signup(apiData);

      setSuccess('Account created successfully! You can now login.');
      // Reset form
      setFormData({
        userName: '',
        email: '',
        fullName: '',
        role: ['Admin'],
        password: '',
        confirmPassword: '',
        gender: 'male',
        dateOfBirth: '',
        address: '',
        cityId: 1,
        age: ''
      });
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {

      try {
        // Use the onLogin function from AuthContext if provided, otherwise use authService
        await authService.login({
          username: formData.userName,
          password: formData.password,
        });

        // Redirect logic can be added here or handled by the parent component
      } catch (err) {
        setError(err.message || 'Invalid username or password. Please try again.');
      } finally {
        setIsLoading(false);
        navigate("/");
      }
    }
  };
  
    return (
      <div className="signup-container">
        <div className="signup-form-wrapper">
          <h2>Create Your Medicare Account</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="signup-form">

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="userName">Username *</label>
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
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cityId">City</label>
              <select
                id="cityId"
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
              >
                {City.map((city,Index) => (
                    <option key={city} value={Index+1}> {city}</option>
                ))}
                {/* You can fetch and populate cities from API if available */}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role[0]}
                onChange={handleRoleChange}
              >
                <option value="User">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="signup-button"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
            
            <div className="login-link">
              Already have an account? <a href="/login">Login here</a>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default SignupForm;