const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    stock: { type: Number, default: 0, min: [0, 'Stock cannot be negative'], validate: { validator: Number.isInteger, message: 'Stock must be a whole number' } },
    category: { type: String, trim: true, default: 'General', index: true },
    image: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
