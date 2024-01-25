import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const themes = {
  dark: 'dracula',
  light: 'pastel',
};


const getThemeFromLocalStorage = () => {
  const theme = localStorage.getItem('theme') || themes.light;
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
};

// convert into token. users logic is with API !
// const getFromLocalStorage = () => {
//   return JSON.parse(localStorage.getItem('user')) || null;
// };

const initialState = {
  user: getFromLocalStorage(),
  user: {username: 'guest'}, // default
  theme: getThemeFromLocalStorage(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      console.log('login action', action)
      console.log('login state', state)
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    },
    toggleTheme: (state) => {
      const { light, dark } = themes;
      state.theme = state.theme === light ? dark : light;
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('theme', state.theme);
    },
  },
});

export const { login, logoutUser, toggleTheme } = userSlice.actions;

export default userSlice.reducer;
