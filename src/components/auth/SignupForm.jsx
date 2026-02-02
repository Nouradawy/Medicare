import React, { useState } from 'react';
import {useNavigate, Link, redirect} from 'react-router-dom';
import './SignupForm.css';
import authService from '../../services/authService';
import {City} from "../../Constants/constant.jsx";
import {scale} from "framer-motion";
// Adjust the import path as necessary


const SignupForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showEmergencyContact, setShowEmergencyContact] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    nationalId: ''
  });
    const [formData, setFormData] = useState({
      userName: '',
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      gender: 'male',
      bloodType: '',
      dateOfBirth: '',
      address: '',
      phoneNumber:'',
      nationalId:'',
      cityId: 1,
      age: '',
      role: ['Patient'],
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: ''
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

    //after form-submission Validation
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
        setErrors(prev => ({ ...prev, password: realTimeValidate(formData.password) }));
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

  const realTimeValidate = (name , value , form =  formData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
switch (name) {
  case 'fullName':
    if(!value.trim()) return  `${name} is required`;
    return '';
  case 'userName':
    if(!value.trim()) return  `${name} is required`;
    if(value.trim().length < 3) return  `${name} must be at least 3 characters`;
    return '';
  case 'email':
      if(!value.trim()) return  `${name} is required`;
      if (!emailRegex.test(value)) return 'please enter a valid email address';
      return '';
  case 'password':
        if(!value.trim()) return  `${name} is required`;
        if(value.trim().length < 6) return  `${name} must be at least 6 characters`;
        return '';
  case 'confirmPassword':
          if(!value.trim()) return  `${name} is required`;
          if(value !== form.password) return  `${name} do not match`;
          return '';
  case 'phoneNumber':
            if(!value.trim()) return  `${name} is required`;
            if (!/^\d{7,15}$/.test(value.trim())) return 'Phone number must be 7-15 digits';
            return '';
  case 'nationalId':
              if(!value.trim()) return  `${name} is required`;
              if (!/^\d{10,20}$/.test(value.trim())) return 'National ID must be 10-20 digits';
              return '';
  default:
  return '';
}
  };
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      setIsLoading(true);
      setError('');

      
      // Prepare data for API (remove confirmPassword as it's not needed in the API)
    const apiData = { ...formData };
    delete apiData.confirmPassword;

    try {
      await authService.signup(apiData);

      setSuccess('Account created successfully! You can now login.');
      // Reset form
      setFormData({
        userName: '',
        email: '',
        fullName: '',
        role: ['Patient'],
        password: '',
        confirmPassword: '',
        gender: 'male',
        bloodType: '',
        dateOfBirth: '',
        address: '',
        phoneNumber:'',
        nationalId:'',
        cityId: 1,
        age: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: ''
      });

      await authService.login({
        username: apiData.userName,
        password: apiData.password,
      });

      navigate("/");
    } catch (err) {
      const msg =
          err?.response?.data?.message ||
          err?.message ||
          'An error occurred during signup';
      setError(msg);
    }  finally {
      setIsLoading(false);
    }


  };
  
    return (
      <div className="signup-container">
        <div className="signup-form-wrapper">
          <h2>Create Your Medicare Account</h2>
          

          
          <form onSubmit={handleSubmit} className="signup-form">

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter the full name"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={(e) =>
                    setErrors((prev) => ({
                      ...prev,
                      fullName: realTimeValidate('fullName', e.target.value)
                    }))
                }
                required
              />
              {errors.fullName && (
                  <small className="field-error text-red-500">{errors.fullName}</small>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="userName">Username *</label>
              <input
                type="text"
                id="userName"
                name="userName"
                placeholder="Enter the Display name"
                value={formData.userName}
                onChange={handleChange}
                onBlur={(e) =>
              setErrors((prev)=>
                  ({
                    ...prev,
                    userName: realTimeValidate('username', e.target.value)
                  }))
              }
                required
              />
              {errors.userName && (<small className="field-error text-red-500">{errors.userName}</small>)}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={(e) =>
                    setErrors((prev)=> ({...prev , email: realTimeValidate('email', e.target.value)}))}
                required
              />
              {errors.email && (<small className="field-error text-red-500">{errors.email}</small>)}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="must be at least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={(e) =>
                      setErrors(prev => ({
                        ...prev,
                        password: realTimeValidate('password',e.target.value)
                      }))
                  }
                  required

                />
                {errors.password && (
                    <small className="field-error text-red-500">{errors.password}</small>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={(e) =>
                      setErrors(prev => ({
                        ...prev,
                        password: realTimeValidate('confirmPassword',e.target.value)
                      }))
                  }
                  required
                />
                {errors.confirmPassword && (<small className="field-error text-red-500">{errors.confirmPassword}</small>)}
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
              <label htmlFor="bloodType">Blood Type</label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
              >
                <option value="">Select Blood Type</option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
              </select>
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
              <label htmlFor="nationalId">National ID *</label>
              <input
                  type="text"
                  id="nationalId"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}

                  onBlur={(e) => setErrors(prev => ({
                    ...prev,
                    nationalId: realTimeValidate('nationalId', e.target.value)
                  }))
              }
                  required
              />
              {errors.nationalId && (<small className="field-error text-red-500">{errors.nationalId}</small>)}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">phone number *</label>
              <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={(e) => setErrors(prev => ({
                    ...prev,
                    phoneNumber: realTimeValidate('phoneNumber', e.target.value)
                  }))
                  }
                  required
              />
              {errors.phoneNumber && (<small className="field-error text-red-500">{errors.phoneNumber}</small>)}
            </div>

            <div
                className="dropdown-header"
                style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}
            >
              <button
                  type="button"
                  className="flex dropdown-toggle-button justify-center"
                  onClick={() => setShowEmergencyContact(prev => !prev)}
              >
                {showEmergencyContact ? <span className="material-icons-round " >
                                              keyboard_arrow_down </span>
                  : <span className="material-icons-round " >
                  keyboard_arrow_right
                </span>
                }Emergency Contact - optional
              </button>
            </div>

            {showEmergencyContact && (
                <>
                  <div className="form-group">
                    <label htmlFor="emergencyContactName">Emergency Contact Name</label>
                    <input
                        type="text"
                        id="emergencyContactName"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleChange}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
                      <input
                          type="text"
                          id="emergencyContactPhone"
                          name="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="emergencyContactRelation">Relation</label>
                      <select
                          id="emergencyContactRelation"
                          name="emergencyContactRelation"
                          value={formData.emergencyContactRelation}
                          onChange={handleChange}
                      >
                        <option value="">Select Relation</option>
                        <option value="Parent">Parent</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Child">Child</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </>
            )}

            
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
            {error && <div className="error-message">{error}</div>}
            <div className="form-actions">
              <button 
                type="submit" 
                className="signup-button"
                disabled={
                    isLoading ||
                    !formData.userName ||
                    !formData.fullName ||
                    !formData.email ||
                    !formData.password ||
                    !formData.confirmPassword ||
                    !!errors.fullName ||
                    !!errors.userName ||
                    !!errors.email ||
                    !!errors.password ||
                    !!errors.confirmPassword ||
                    !!errors.phoneNumber ||
                    !!errors.nationalId
                }
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