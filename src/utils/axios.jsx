import axios from 'axios';
// import { clearStore } from '../features/users/userSlice';
import { getFromLocalStorage } from './localStorage';

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

customFetch.interceptors.request.use((config) => {
  const user = getFromLocalStorage();
  if (user) {
    config.headers['Authorization'] = `Bearer ${user.token}`;
  }
  return config;
});

export const checkForUnauthorizedResponse = (error, thunkAPI) => {
  if (error.response.status === 401) {
    // thunkAPI.dispatch(clearStore());
    return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
  }
  return thunkAPI.rejectWithValue(error.response.data.msg);
};

export default customFetch;
