import { createSlice } from '@reduxjs/toolkit';

/**
 * Cargar el estado inicial de la lista de deseos desde localStorage (si existe)
 * para asegurar la persistencia entre sesiones del usuario.
 */
const loadWishlistFromStorage = () => {
  try {
    const serializedWishlist = localStorage.getItem('marketplace_wishlist');
    if (serializedWishlist === null) {
      return [];
    }
    return JSON.parse(serializedWishlist);
  } catch (error) {
    console.error('Error al cargar la lista de deseos desde localStorage:', error);
    return [];
  }
};

/**
 * Guardar el estado actual de la lista de deseos en localStorage
 */
const saveWishlistToStorage = (wishlistItems) => {
  try {
    const serializedWishlist = JSON.stringify(wishlistItems);
    localStorage.setItem('marketplace_wishlist', serializedWishlist);
  } catch (error) {
    console.error('Error al guardar la lista de deseos en localStorage:', error);
  }
};

const initialState = {
  wishlistItems: loadWishlistFromStorage(),
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    /**
     * Alternar el estado de un producto en la lista de deseos:
     * Si ya existe, se elimina; si no existe, se añade.
     */
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const existingIndex = state.wishlistItems.findIndex((item) => item._id === product._id);

      if (existingIndex >= 0) {
        // Remover si ya está en la lista
        state.wishlistItems.splice(existingIndex, 1);
      } else {
        // Añadir si no está presente
        state.wishlistItems.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          compareAtPrice: product.compareAtPrice || null,
          images: product.images || [],
          shop: product.shop,
          stock: product.stock,
          category: product.category,
        });
      }

      saveWishlistToStorage(state.wishlistItems);
    },

    /**
     * Eliminar explícitamente un producto de la lista de deseos por su ID.
     */
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.wishlistItems = state.wishlistItems.filter((item) => item._id !== productId);
      saveWishlistToStorage(state.wishlistItems);
    },

    /**
     * Vaciar completamente la lista de deseos.
     */
    clearWishlist: (state) => {
      state.wishlistItems = [];
      saveWishlistToStorage(state.wishlistItems);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;