const API_URL = 'https://medicareb.work.gd/api/';

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
        const response = await fetch(`${API_URL}public/currentUser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`

          }
        });
        const userdata = await response.json();
        if (!response.ok) {
          console.log('Failed to fetch current user:', response.status);
          throw new Error(data.message || 'Failed to fetch current user');
        }
        if(data.username) {
          localStorage.setItem('userData', JSON.stringify(userdata || {}));
        }


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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
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