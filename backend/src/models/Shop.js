const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    shopName: { type: String, required: [true, 'Shop name is required'], trim: true },
    description: { type: String, trim: true, default: '' },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shop', shopSchema);
