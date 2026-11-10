const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const pick = require('../utils/pick');
const { asyncHandler } = require('../middleware/errorMiddleware');

const ADDRESS_REQUIRED = ['fullName', 'phone', 'address', 'city', 'postalCode'];
const FLOW = ['Pending', 'Processing', 'Shipped', 'Delivered'];

// POST /api/orders  (customer)
// body: { items: [{ productId, quantity }], shippingAddress, paymentMethod }
// Prices come from the DB (never the client). Stock is decremented atomically per
// product; if anything fails, already-reserved stock is released. The cart is split
// into one order per shop.
exports.createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod = 'Cash on Delivery' } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }
  if (!['Cash on Delivery', 'Simulated'].includes(paymentMethod)) {
    res.status(400);
    throw new Error('Invalid payment method');
  }
  if (!shippingAddress || ADDRESS_REQUIRED.some((k) => !String(shippingAddress[k] || '').trim())) {
    res.status(400);
    throw new Error('A complete shipping address is required');
  }

  const wanted = new Map(); // productId -> quantity (duplicates merged)
  for (const it of items) {
    const qty = parseInt(it.quantity, 10);
    if (!it.productId || !(qty > 0)) {
      res.status(400);
      throw new Error('Each item needs a productId and a quantity of at least 1');
    }
    const key = String(it.productId);
    wanted.set(key, (wanted.get(key) || 0) + qty);
  }

  const reserved = [];
  try {
    const lines = [];
    for (const [productId, qty] of wanted) {
      const product = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { returnDocument: 'after' }
      );
      if (!product) {
        const existing = await Product.findById(productId).select('title');
        res.status(400);
        throw new Error(existing ? `Not enough stock for "${existing.title}"` : 'A product in your cart no longer exists');
      }
      reserved.push({ productId: product._id, qty });
      lines.push({ product, qty });
    }

    const byShop = {};
    for (const line of lines) (byShop[line.product.shopId] ||= []).push(line);

    const docs = Object.entries(byShop).map(([shopId, shopLines]) => ({
      customerId: req.user._id,
      shopId,
      items: shopLines.map(({ product, qty }) => ({
        productId: product._id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: qty,
      })),
      shippingAddress: pick(shippingAddress, [...ADDRESS_REQUIRED, 'country']),
      paymentMethod,
      totalPrice: shopLines.reduce((sum, { product, qty }) => sum + product.price * qty, 0),
    }));

    res.status(201).json(await Order.create(docs));
  } catch (err) {
    await Promise.all(reserved.map((r) => Product.updateOne({ _id: r.productId }, { $inc: { stock: r.qty } })));
    throw err;
  }
});

// GET /api/orders/my  (customer)
exports.getMyOrders = asyncHandler(async (req, res) => {
  res.json(await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 }).populate('shopId', 'shopName'));
});

// GET /api/orders/seller  (seller: orders for their shop)
exports.getSellerOrders = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ ownerId: req.user._id });
  if (!shop) return res.json([]);
  res.json(await Order.find({ shopId: shop._id }).sort({ createdAt: -1 }).populate('customerId', 'name email'));
});

// PUT /api/orders/:id/status  (seller; forward-only: Pending -> Processing -> Shipped -> Delivered)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!FLOW.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${FLOW.join(', ')}`);
  }
  const shop = await Shop.findOne({ ownerId: req.user._id });
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (!shop || String(order.shopId) !== String(shop._id)) {
    res.status(403);
    throw new Error('This order does not belong to your shop');
  }
  if (FLOW.indexOf(status) <= FLOW.indexOf(order.status)) {
    res.status(400);
    throw new Error(`Order is already ${order.status}`);
  }
  order.status = status;
  res.json(await order.save());
});
