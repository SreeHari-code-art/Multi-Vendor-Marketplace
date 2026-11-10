const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { asyncHandler } = require('../middleware/errorMiddleware');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const publicUser = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role });

// POST /api/auth/register  — role: customer (default) | seller (also creates a shop)
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, shopName, description } = req.body;
  const role = req.body.role === 'seller' ? 'seller' : 'customer'; // admins are never self-registered

  if (role === 'seller' && !String(shopName || '').trim()) {
    res.status(400);
    throw new Error('Shop name is required for sellers');
  }
  if (await User.findOne({ email: String(email || '').toLowerCase().trim() })) {
    res.status(400);
    throw new Error('Email is already registered');
  }

  const user = await User.create({ name, email, password, role });
  if (role === 'seller') {
    try {
      await Shop.create({ ownerId: user._id, shopName, description });
    } catch (err) {
      await user.deleteOne(); // don't leave a seller without a shop
      throw err;
    }
  }
  res.status(201).json({ user: publicUser(user), token: signToken(user._id) });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase().trim() }).select('+password');
  if (!user || !(await user.matchPassword(String(password || '')))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.json({ user: publicUser(user), token: signToken(user._id) });
});

// GET /api/auth/me
exports.getMe = (req, res) => res.json(publicUser(req.user));
