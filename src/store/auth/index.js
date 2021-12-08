import {createSlice} from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    email: null,
    accessToken: null,
    serverAuthCode: null,
    userId: null,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
      state.serverAuthCode = action.payload.serverAuthCode;
      state.userId = action.payload.userId;
    },
    logout: state => {
      state.token = null;
      state.email = null;
      state.accessToken = null;
      state.serverAuthCode = null;
      state.userId = null;
    },
    updateToken: (state, action) => {
      state.token = action.payload.token;
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const {login, logout, updateToken} = authSlice.actions;

export const getEmail = state => state.auth.email;
export const getToken = state => state.auth.token;
export const getAccessToken = state => state.auth.accessToken;
export const getServerAuthCode = state => state.auth.serverAuthCode;
export const getUserId = state => state.auth.userId;

export const isLoggedIn = state => {
  if (state.auth.token) {
    return true;
  }
  return false;
};

export default authSlice.reducer;
