import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

const initialSliceState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialSliceState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      localStorage.removeItem('accessToken');
    },
  },
});

export const getAuthState = (state: RootState) => state.auth.isAuthenticated;
export const getAuthUser = (state: RootState) => state.auth.user;
export const getAuthLoading = (state: RootState) => state.auth.isLoading;

export const { setAuthenticated, setUser, setLoading, logout } =
  authSlice.actions;
export default authSlice.reducer;
