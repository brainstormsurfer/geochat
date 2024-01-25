// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { toast } from 'react-toastify';
// import {
//   addToLocalStorage,
//   getFromLocalStorage,
//   removeFromLocalStorage,
// } from '../../utils/localStorage';
// import {
//   loginThunk,
//   registerThunk,
//   updateUserThunk,
//   clearStoreThunk,
// } from './userThunk';

// const initialState = {
//   isLoading: false,
//   // isSidebarOpen: false,
//   user: getFromLocalStorage(),
// };

// export const register = createAsyncThunk(
//   'users/register',
//   async (user, thunkAPI) => {
//     return registerThunk('/auth/register', user, thunkAPI);
//   }
// );

// export const login = createAsyncThunk(
//   'users/login',
//   async (user, thunkAPI) => {
//     return loginThunk('/auth/login', user, thunkAPI);
//   }
// );

// export const update = createAsyncThunk(
//   'users/update',
//   async (user, thunkAPI) => {
//     return updateUserThunk('/auth/update', user, thunkAPI);
//   }
// );
// export const clearStore = createAsyncThunk('users/clearStore', clearStoreThunk);
// const userSlice = createSlice({
//   name: 'token',
//   initialState,
//   reducers: {
//     // toggleSidebar: (state) => {
//       // // state.isSidebarOpen = !state.isSidebarOpen;
//     },
//     logoutUser: (state, { payload }) => {
//       state.token = null;
//       // state.isSidebarOpen = false;
//       removeFromLocalStorage();
//       if (payload) {
//         toast.success(payload);
//       }
//     },

//   extraReducers: (builder) => {
//     builder
//       .addCase(register.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(register.fulfilled, (state, { payload }) => {
//         const { token } = payload;
//         state.isLoading = false;
//         state.token = user;
//         addToLocalStorage(token);
//         toast.success(`Hello There ${user.name}`);
//       })
//       .addCase(register.rejected, (state, { payload }) => {
//         state.isLoading = false;
//         toast.error(payload);
//       })
//       .addCase(login.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(login.fulfilled, (state, { payload }) => {
//         const { token } = payload;
//         state.isLoading = false;
//         state.token = user;
//         addToLocalStorage(token);

//         toast.success(`Welcome Back ${user.name}`);
//       })
//       .addCase(login.rejected, (state, { payload }) => {
//         state.isLoading = false;
//         toast.error(payload);
//       })
//       .addCase(update.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(update.fulfilled, (state, { payload }) => {
//         const { token } = payload;
//         state.isLoading = false;
//         state.token = user;
//         addToLocalStorage(token);

//         toast.success(`User Updated!`);
//       })
//       .addCase(update.rejected, (state, { payload }) => {
//         state.isLoading = false;
//         toast.error(payload);
//       })
//       .addCase(clearStore.rejected, () => {
//         toast.error('There was an error..');
//       });
//   },
// });

// // // export const { toggleSidebar, logoutUser } = userSlice.actions;
// export default userSlice.reducer;

import {
    addToLocalStorage,
    getFromLocalStorage,
    removeFromLocalStorage,
  } from '../../utils/localStorage';


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

const initialState = {
  token: nul, 
  theme: getThemeFromLocalStorage(),
};

const userSlice = createSlice({
  name: 'human',
  initialState,
  reducers: {
    
    register: (state, {payload}) => {      
      console.log("register {payload}", payload)
      const {token} = {payload};
      state.token = token
      addToLocalStorage(token);    
    },

    login: (state, {payload}) => {
      console.log("login {payload}", payload)
      const {token} = payload
      state.token = token,
      addToLocalStorage(token)
    },
    logoutUser: (state) => {      
      state.token = null;
      removeFromLocalStorage()
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

export const { register, login, logoutUser, toggleTheme } = userSlice.actions;

export default userSlice.reducer;
