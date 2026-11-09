import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  products: [],
  product: null,
  sellerProducts: [],
  isLoading: false,
  isError: false,
  success: false,
  message: '',
};

/**
 * ==========================================
 * Async Thunks (Acciones Asíncronas)
 * ==========================================
 */

/**
 * Obtener todos los productos (con soporte opcional para filtros o paginación en query string)
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (queryString = '', thunkAPI) => {
    try {
      const response = await api.get(`/products${queryString}`);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Obtener un producto específico por su ID
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, thunkAPI) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Obtener los productos pertenecientes a la tienda del vendedor autenticado
 */
export const fetchSellerProducts = createAsyncThunk(
  'products/fetchSellerProducts',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/products/seller/my-products');
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Crear un nuevo producto (Exclusivo para Vendedores)
 */
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, thunkAPI) => {
    try {
      const response = await api.post('/products', productData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Actualizar un producto existente (Exclusivo para Vendedores dueños)
 */
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, thunkAPI) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Eliminar un producto (Exclusivo para Vendedores dueños o Administradores)
 */
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (productId, thunkAPI) => {
    try {
      await api.delete(`/products/${productId}`);
      return productId; // Retornamos el ID para removerlo del estado localmente
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
export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.success = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data?.products || action.payload.products || action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload.data?.product || action.payload.product || action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Fetch Seller Products
      .addCase(fetchSellerProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sellerProducts = action.payload.data?.products || action.payload.products || action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        const newProduct = action.payload.data?.product || action.payload.product || action.payload;
        state.sellerProducts.unshift(newProduct);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        const updated = action.payload.data?.product || action.payload.product || action.payload;
        state.sellerProducts = state.sellerProducts.map((p) => (p._id === updated._id ? updated : p));
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.success = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.sellerProducts = state.sellerProducts.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;