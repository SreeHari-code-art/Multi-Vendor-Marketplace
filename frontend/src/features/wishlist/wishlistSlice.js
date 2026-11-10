import { createSlice } from '@reduxjs/toolkit';

const load = () => {
  try { return JSON.parse(localStorage.getItem('wishlist')) || []; } catch { return []; }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: load() },
  reducers: {
    toggleWishlist(state, { payload: p }) {
      const i = state.items.findIndex((x) => x._id === p._id);
      if (i >= 0) state.items.splice(i, 1);
      else state.items.push({ _id: p._id, title: p.title, price: p.price, image: p.image, stock: p.stock, category: p.category, shopId: p.shopId });
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
