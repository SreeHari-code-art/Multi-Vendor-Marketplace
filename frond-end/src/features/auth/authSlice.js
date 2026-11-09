import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

/**
 * Cargar el usuario y token almacenados previamente en localStorage (si existen)
 * para mantener la sesión activa al recargar la página.
 */
const storedUser = localStorage.getItem('marketplace_user');
const storedToken = localStorage.getItem('marketplace_token');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  isLoading: false,
  error: null,
};

/**
 * ==========================================
 * Async Thunks (Acciones Asíncronas)
 * ==========================================
 */

/**
 * Registro de un nuevo usuario (Cliente o Vendedor)
 */
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Si la API retorna un token, lo guardamos en localStorage
      if (response.token) {
        localStorage.setItem('marketplace_token', response.token);
        const userInfo = response.data?.user || response.user || response.data;
        localStorage.setItem('marketplace_user', JSON.stringify(userInfo));
      }
      
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Inicio de sesión de usuario
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.token) {
        localStorage.setItem('marketplace_token', response.token);
        const userInfo = response.data?.user || response.user || response.data;
        localStorage.setItem('marketplace_user', JSON.stringify(userInfo));
      }
      
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Obtener perfil del usuario autenticado actual (/me)
 */
export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/auth/me');
      const userInfo = response.data?.user || response.user || response.data;
      
      // Actualizar usuario en localStorage
      localStorage.setItem('marketplace_user', JSON.stringify(userInfo));
      
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * ==========================================
 * Configuración del Slice
 * ==========================================
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('marketplace_token');
      localStorage.removeItem('marketplace_user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos para Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.data?.user || action.payload.user || action.payload.data;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Casos para Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.data?.user || action.payload.user || action.payload.data;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Casos para GetMe
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.data?.user || action.payload.user || action.payload.data;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;