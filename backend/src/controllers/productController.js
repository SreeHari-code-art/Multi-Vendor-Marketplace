const Product = require('../models/Product');
const Shop = require('../models/Shop');

// ==================== PUBLIC ENDPOINTS ====================

// 1. Get All Products (with Search, Category Filter, and Sorting)
exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
    let query = { isActive: true };

    // Search by product name or description (case-insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category.toLowerCase();
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Pagination setup
    const skip = (Number(page) - 1) * Number(limit);

    // Sorting setup
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };

    const products = await Product.find(query)
      .populate('shop', 'shopName verificationStatus')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      products
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shop', 'shopName description address verificationStatus');
    
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== VENDOR CRUD ENDPOINTS ====================

// 3. Create Product (Vendor only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, images } = req.body;

    // Find the shop owned by the logged-in seller
    const shop = await Shop.findOne({ seller: req.user.id });
    if (!shop) {
      return res.status(404).json({ message: 'You must create a shop profile before adding products' });
    }

    if (shop.verificationStatus !== 'approved') {
      return res.status(403).json({ message: 'Your shop must be verified by an admin before you can list products' });
    }

    const product = await Product.create({
      shop: shop._id,
      name,
      description,
      price,
      stock,
      category: category.toLowerCase(),
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

// 4. Update Product (Vendor only - must own the shop tied to the product)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find product first
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify ownership via shop
    const shop = await Shop.findById(product.shop);
    if (!shop || shop.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 5. Delete Product (Vendor only - soft delete or hard delete)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify ownership via shop
    const shop = await Shop.findById(product.shop);
    if (!shop || shop.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    // Option A: Hard delete
    await product.deleteOne();

    // Option B (Alternative): Soft delete -> product.isActive = false; await product.save();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};