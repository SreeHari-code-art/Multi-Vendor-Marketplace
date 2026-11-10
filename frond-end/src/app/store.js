import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';

const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('marketplace_cart');
    if (serializedCart === null) {
      return undefined;
    }
    return JSON.parse(serializedCart);
  } catch (error) {
    console.error('Error al cargar el carrito desde localStorage:', error);
    return undefined;
  }
};

const loadWishlistFromStorage = () => {
  try {
    const serializedWishlist = localStorage.getItem('marketplace_wishlist');
    if (serializedWishlist === null) {
      return { wishlistItems: [] };
    }
    return { wishlistItems: JSON.parse(serializedWishlist) };
  } catch (error) {
    console.error('Error al cargar la lista de deseos desde localStorage:', error);
    return { wishlistItems: [] };
  }
};

const saveCartToStorage = (state) => {
  try {
    const serializedCart = JSON.stringify(state.cart);
    localStorage.setItem('marketplace_cart', serializedCart);
  } catch (error) {
    console.error('Error al guardar el carrito en localStorage:', error);
  }
};

const saveWishlistToStorage = (state) => {
  try {
    const serializedWishlist = JSON.stringify(state.wishlist.wishlistItems);
    localStorage.setItem('marketplace_wishlist', serializedWishlist);
  } catch (error) {
    console.error('Error al guardar la lista de deseos en localStorage:', error);
  }
};

const preloadedState = {
  cart: loadCartFromStorage(),
  wishlist: loadWishlistFromStorage(),
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

store.subscribe(() => {
  const state = store.getState();
  saveCartToStorage(state);
  saveWishlistToStorage(state);
});

export default store;