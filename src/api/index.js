import axios from 'axios';

import { showToast } from '../utils';
import { getFromLocalStorage } from '../utils/localStorage';

const baseURL = import.meta.env.VITE_BASE_URL;

// Create a new instance of the axios library with a base URL of '/api/v1'
const API = axios.create({ baseURL });

// Response interceptor that handles errors
API.interceptors.response.use(
    response => response,
    error => {
        if (!error.response) {
            showToast('Network error: Please check your internet connection.', 'error');
            console.error('Network error: Please check your internet connection.');
            return Promise.reject(new Error('Network error: Please check your internet connection.'));
        }
        if (error.response.status === 401) {
            thunkAPI.dispatch(clearStore());
            return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
          }
          return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    //     const { status, data, statusText } = error.response;

    //     let message = data?.error || statusText || 'An error occurred';

    //     console.error(`${status} - ${message}`);

    //     return Promise.reject(error);
    // }
);

// Request interceptor that handles login
API.interceptors.request.use((config) => {
    const user = getFromLocalStorage();
    if (user) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  });
  
//   export const checkForUnauthorizedResponse = (error, thunkAPI) => {
//     if (error.response.status === 401) {
//       thunkAPI.dispatch(clearStore());
//       return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
//     }
//     return thunkAPI.rejectWithValue(error.response.data.msg);
//   };

// Set the authorization token in the headers
export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
};

// Auth API endpoints
export const authAPI = {
    // Register a new user
    register: (userData) => API.post('/auth/register', userData),
    // Login a user
    login: (email, password) => API.post('/auth/login', { email, password }),
    // Logout a user
    logout: () => API.get('/auth/logout'),
    // Get the current user
    getCurrentUser: () => API.get('/auth/current-user'),
};

// // Helper API endpoints
// export const helperAPI = {
//     // Get all helpers
//     getAllHelpers: () => API.get('/helpers'),
//     // Get a specific helper
//     getHelper: (helperId) => API.get(`/helpers/${helperId}`),
//     // Update a helper
//     updateHelper: (helper, helperId) => API.put(`/helpers/${helperId}`, helper),
//     // Add a helper
//     addHelper: (helper) => API.post('/helpers', helper),
//     // Delete a helper
//     deleteHelper: (helperId) => API.delete(`/helpers/${helperId}`),
// };