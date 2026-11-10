import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { errMsg } from '../../utils/format';

export const fetchProducts = createAsyncThunk('products/fetch', async (params, { rejectWithValue }) => {
  try {
    return (await api.get('/products', { params })).data;
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

export const fetchCategories = createAsyncThunk('products/categories', async () => (await api.get('/products/categories')).data);

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], page: 1, pages: 1, total: 0, categories: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, { payload }) => {
        s.status = 'succeeded';
        s.items = payload.products;
        s.page = payload.page;
        s.pages = payload.pages;
        s.total = payload.total;
      })
      .addCase(fetchProducts.rejected, (s, { payload }) => { s.status = 'failed'; s.error = payload; })
      .addCase(fetchCategories.fulfilled, (s, { payload }) => { s.categories = payload; });
  },
});

export default productSlice.reducer;
