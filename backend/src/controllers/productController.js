const Product = require('../models/Product');
const Shop = require('../models/Shop');

// Create a new product (Sellers only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, images } = req.body;

    // Find the shop belonging to the logged-in seller
    const shop = await Shop.findOne({ seller: req.user.id });
    if (!shop) {
      return res.status(404).json({ message: 'You must create a shop profile before adding products' });
    }

    // Optional: Check if shop is verified by admin before allowing product creation
    if (shop.verificationStatus !== 'approved') {
      return res.status(403).json({ message: 'Your shop must be verified by an admin before you can list products' });
    }

    const product = await Product.create({
      shop: shop._id,
      name,
      description,
      price,
      stock,
      category,
      images
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all products (Public route with optional filters like category)
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category.toLowerCase();
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    const products = await Product.find(query).populate('shop', 'shopName verificationStatus');
    
    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};