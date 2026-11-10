import { createSlice } from '@reduxjs/toolkit';

const load = () => {
  try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: load() },
  reducers: {
    // payload: { product, quantity }
    addToCart(state, { payload: { product, quantity = 1 } }) {
      const existing = state.items.find((i) => i.productId === product._id);
      if (existing) {
        existing.stock = product.stock;
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      } else if (product.stock > 0) {
        state.items.push({
          productId: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
          stock: product.stock,
          shopName: product.shopId?.shopName,
          quantity: Math.min(quantity, product.stock),
        });
      }
    },
    setQuantity(state, { payload: { productId, quantity } }) {
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity = Math.max(1, Math.min(quantity, item.stock));
    },
    removeFromCart(state, { payload }) {
      state.items = state.items.filter((i) => i.productId !== payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const selectCartTotal = (s) => s.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const { addToCart, setQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
