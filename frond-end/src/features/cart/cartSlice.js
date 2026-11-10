import { createSlice } from '@reduxjs/toolkit';

/**
 * Estado inicial del carrito. 
 * Si ya existe información previa en localStorage, el store la hidratará automáticamente.
 */
const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
};

/**
 * Función auxiliar para recalcular el número total de artículos y el monto global.
 */
const calculateTotals = (state) => {
  let totalQuantity = 0;
  let totalAmount = 0;

  state.cartItems.forEach((item) => {
    totalQuantity += item.quantity;
    totalAmount += item.price * item.quantity;
  });

  state.totalQuantity = totalQuantity;
  state.totalAmount = totalAmount;
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Añadir un producto al carrito o incrementar su cantidad si ya existe.
     */
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === newItem._id);

      if (!existingItem) {
        state.cartItems.push({
          _id: newItem._id,
          name: newItem.name,
          price: newItem.price,
          images: newItem.images || [],
          shop: newItem.shop,
          stock: newItem.stock,
          quantity: newItem.quantity || 1,
        });
      } else {
        // Incrementar cantidad asegurándose de no superar el stock disponible
        const requestedQty = existingItem.quantity + (newItem.quantity || 1);
        existingItem.quantity = requestedQty <= existingItem.stock ? requestedQty : existingItem.stock;
      }

      calculateTotals(state);
    },

    /**
     * Eliminar un producto completo del carrito por su ID.
     */
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item._id !== productId);
      calculateTotals(state);
    },

    /**
     * Actualizar la cantidad específica de un producto en el carrito.
     */
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i._id === id);

      if (item) {
        if (quantity <= 0) {
          // Si la cantidad es 0 o menor, removemos el ítem
          state.cartItems = state.cartItems.filter((i) => i._id !== id);
        } else if (quantity <= item.stock) {
          item.quantity = quantity;
        } else {
          // Limitar al stock máximo si se excede
          item.quantity = item.stock;
        }
      }

      calculateTotals(state);
    },

    /**
     * Vaciar completamente el carrito (por ejemplo, tras completar una orden exitosa).
     */
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;