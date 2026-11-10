import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import productReducer from '../features/products/productSlice';

export const store = configureStore({
  reducer: { auth: authReducer, cart: cartReducer, wishlist: wishlistReducer, products: productReducer },
});

// Persist cart + wishlist so they survive a refresh.
store.subscribe(() => {
  const { cart, wishlist } = store.getState();
  localStorage.setItem('cart', JSON.stringify(cart.items));
  localStorage.setItem('wishlist', JSON.stringify(wishlist.items));
});
