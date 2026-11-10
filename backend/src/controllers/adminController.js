const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { asyncHandler } = require('../middleware/errorMiddleware');

// GET /api/admin/stats
exports.getStats = asyncHandler(async (req, res) => {
  const [users, shops, pendingShops, products, orders, revenue] = await Promise.all([
    User.countDocuments(),
    Shop.countDocuments(),
    Shop.countDocuments({ isVerified: false }),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
  ]);
  res.json({ users, shops, pendingShops, products, orders, revenue: revenue[0]?.total || 0 });
});

// GET /api/admin/users
exports.getUsers = asyncHandler(async (req, res) => {
  res.json(await User.find().sort({ createdAt: -1 }));
});

// PUT /api/admin/users/:id/role  — promote/demote between customer and admin
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Role must be customer or admin');
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (String(user._id) === String(req.user._id)) {
    res.status(400);
    throw new Error('You cannot change your own role');
  }
  if (user.role === 'seller') {
    res.status(400);
    throw new Error('Seller accounts cannot be re-assigned; delete the account instead');
  }
  user.role = role;
  await user.save();
  res.json(user);
});

// DELETE /api/admin/users/:id  — a seller's shop and products are removed too
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (String(user._id) === String(req.user._id)) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }
  if (user.role === 'seller') {
    const shop = await Shop.findOneAndDelete({ ownerId: user._id });
    if (shop) await Product.deleteMany({ shopId: shop._id });
  }
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

// GET /api/admin/shops
exports.getShops = asyncHandler(async (req, res) => {
  res.json(await Shop.find().sort({ createdAt: -1 }).populate('ownerId', 'name email'));
});

// PUT /api/admin/shops/:id/verify  — body { isVerified: boolean } (defaults to toggling)
exports.verifyShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) {
    res.status(404);
    throw new Error('Shop not found');
  }
  shop.isVerified = typeof req.body.isVerified === 'boolean' ? req.body.isVerified : !shop.isVerified;
  await shop.save();
  res.json(await shop.populate('ownerId', 'name email'));
});

// GET /api/admin/orders  — platform-wide
exports.getOrders = asyncHandler(async (req, res) => {
  res.json(
    await Order.find().sort({ createdAt: -1 }).limit(200).populate('customerId', 'name email').populate('shopId', 'shopName')
  );
});
