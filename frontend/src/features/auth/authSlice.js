import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { errMsg } from '../../utils/format';

const storedUser = (() => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
})();

const persist = ({ user, token }) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

const makeAuthThunk = (name, url) =>
  createAsyncThunk(`auth/${name}`, async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.post(url, body);
      persist(data);
      return data;
    } catch (e) {
      return rejectWithValue(errMsg(e));
    }
  });

export const login = makeAuthThunk('login', '/auth/login');
export const register = makeAuthThunk('register', '/auth/register');

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: storedUser, token: localStorage.getItem('token'), loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    for (const thunk of [login, register]) {
      builder
        .addCase(thunk.pending, (s) => { s.loading = true; s.error = null; })
        .addCase(thunk.fulfilled, (s, { payload }) => { s.loading = false; s.user = payload.user; s.token = payload.token; })
        .addCase(thunk.rejected, (s, { payload, error }) => { s.loading = false; s.error = payload || error.message; });
    }
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
