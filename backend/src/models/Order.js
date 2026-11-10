const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

// One order per shop: a multi-shop cart is split at checkout so each seller
// only sees and fulfils their own items.
const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },
    items: { type: [itemSchema], validate: [(v) => v.length > 0, 'Order needs at least one item'] },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    paymentMethod: { type: String, enum: ['Cash on Delivery', 'Simulated'], default: 'Cash on Delivery' },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
