const Product = require('../models/Product');
const Shop = require('../models/Shop');
const pick = require('../utils/pick');
const { asyncHandler } = require('../middleware/errorMiddleware');

const FIELDS = ['title', 'description', 'price', 'stock', 'category', 'image'];
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getSellerShop = async (req, res) => {
  const shop = await Shop.findOne({ ownerId: req.user._id });
  if (!shop) {
    res.status(404);
    throw new Error('Create a shop before managing products');
  }
  return shop;
};

// GET /api/products?search=&category=&shopId=&minPrice=&maxPrice=&sort=&page=&limit=
exports.getProducts = asyncHandler(async (req, res) => {
  const { search, category, shopId, minPrice, maxPrice, sort = 'newest' } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 48);

  const filter = {};
  if (search) {
    const rx = new RegExp(escapeRegex(String(search).trim()), 'i');
    filter.$or = [{ title: rx }, { description: rx }, { category: rx }];
  }
  if (category) filter.category = String(category);
  if (shopId) filter.shopId = shopId;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sorts = { newest: { createdAt: -1 }, 'price-asc': { price: 1 }, 'price-desc': { price: -1 } };
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sorts[sort] || sorts.newest)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('shopId', 'shopName isVerified'),
    Product.countDocuments(filter),
  ]);
  res.json({ products, page, pages: Math.ceil(total / limit), total });
});

// GET /api/products/categories
exports.getCategories = asyncHandler(async (req, res) => {
  res.json((await Product.distinct('category')).filter(Boolean).sort());
});

// GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('shopId', 'shopName description isVerified');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// GET /api/products/mine  (seller)
exports.getMyProducts = asyncHandler(async (req, res) => {
  const shop = await getSellerShop(req, res);
  res.json(await Product.find({ shopId: shop._id }).sort({ createdAt: -1 }));
});

// POST /api/products  (seller)
exports.createProduct = asyncHandler(async (req, res) => {
  const shop = await getSellerShop(req, res);
  const product = await Product.create({ ...pick(req.body, FIELDS), shopId: shop._id });
  res.status(201).json(product);
});

// PUT /api/products/:id  (seller, own products only)
exports.updateProduct = asyncHandler(async (req, res) => {
  const shop = await getSellerShop(req, res);
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (String(product.shopId) !== String(shop._id)) {
    res.status(403);
    throw new Error('You can only edit your own products');
  }
  Object.assign(product, pick(req.body, FIELDS));
  res.json(await product.save());
});

// DELETE /api/products/:id  (seller, own products only)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const shop = await getSellerShop(req, res);
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (String(product.shopId) !== String(shop._id)) {
    res.status(403);
    throw new Error('You can only delete your own products');
  }
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});
