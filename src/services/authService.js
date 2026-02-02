import {API_URL} from "../Constants/constant.jsx";
import APICalls from "./APICalls.js";


/**
 * Service for handling authentication-related API calls
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - API response
   */
  signup: async (userData) => {
    try {
      const response = await fetch(`${API_URL}auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  
  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise} - API response with user data and token
   */
  /**
   * Login a user with username and password
   * @param {Object} credentials - Object containing userName and password
   * @returns {Promise} - API response with user data and token
   */
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(credentials)
      });
      console.log(response.status);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage if login successful
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        // localStorage.setItem('userData', JSON.stringify(data.user || {}));
        await APICalls.GetCurrentUser();

      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }


  },
  
  /**
   * Log out the current user
   */
  logout: () => {
    localStorage.clear();
  },
  
  /**
   * Get the current authentication token
   * @returns {string|null} - The current auth token or null if not logged in
   */
  getToken: () => {
    return localStorage.getItem('authToken');
  },
  
  /**
   * Check if user is logged in
   * @returns {boolean} - Whether the user is logged in
   */
  isLoggedIn: () => {
    return !!localStorage.getItem('authToken');
  }
};

export default authService;
