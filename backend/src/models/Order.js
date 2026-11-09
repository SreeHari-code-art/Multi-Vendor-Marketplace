const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // Cliente que realiza la compra
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El pedido debe estar asociado a un cliente'],
    },
    // Artículos del pedido (Soporta múltiples productos de diferentes tiendas)
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        // Referencia a la tienda dueña del producto (Crítico para multi-vendedor)
        shop: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Shop',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'La cantidad mínima por producto es 1'],
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: [0, 'El precio no puede ser negativo'],
        },
      },
    ],
    // Dirección de envío
    shippingAddress: {
      fullName: { type: String, required: [true, 'El nombre del destinatario es obligatorio'] },
      street: { type: String, required: [true, 'La calle es obligatoria'] },
      city: { type: String, required: [true, 'La ciudad es obligatoria'] },
      state: { type: String, required: [true, 'El estado/provincia es obligatorio'] },
      postalCode: { type: String, required: [true, 'El código postal es obligatorio'] },
      country: { type: String, required: [true, 'El país es obligatorio'] },
      phone: { type: String, required: [true, 'El teléfono de contacto es obligatorio'] },
    },
    // Método de pago (Ej: 'Stripe', 'PayPal', 'COD' / Contra entrega)
    paymentMethod: {
      type: String,
      required: [true, 'El método de pago es obligatorio'],
      enum: ['Stripe', 'PayPal', 'COD'],
    },
    // Datos de la pasarela de pago (Webhook response)
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    // Desglose de precios
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    // Estados de pago y entrega
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

// Índices para mejorar el rendimiento en consultas por cliente o estado
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ 'orderItems.shop': 1, orderStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;