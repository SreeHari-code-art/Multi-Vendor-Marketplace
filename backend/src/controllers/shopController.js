const Shop = require('../models/Shop');
const pick = require('../utils/pick');
const { asyncHandler } = require('../middleware/errorMiddleware');

// GET /api/shops/me  (seller)
exports.getMyShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ ownerId: req.user._id });
  if (!shop) {
    res.status(404);
    throw new Error('Shop not found');
  }
  res.json(shop);
});

// PUT /api/shops/me  (seller)
exports.updateMyShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ ownerId: req.user._id });
  if (!shop) {
    res.status(404);
    throw new Error('Shop not found');
  }
  Object.assign(shop, pick(req.body, ['shopName', 'description']));
  res.json(await shop.save());
});

// GET /api/shops  (public: verified shops)
exports.getShops = asyncHandler(async (req, res) => {
  res.json(await Shop.find({ isVerified: true }).select('shopName description isVerified').sort({ shopName: 1 }));
});

// GET /api/shops/:id  (public)
exports.getShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id).select('shopName description isVerified');
  if (!shop) {
    res.status(404);
    throw new Error('Shop not found');
  }
  res.json(shop);
});
