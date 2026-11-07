const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// --- PUBLIC ENDPOINTS ---
router.get('/', getProducts);              // View all products (with search & filters)
router.get('/:id', getProductById);        // View a single product by ID

// --- VENDOR & ADMIN CRUD ENDPOINTS ---
router.post('/', protect, authorize('seller', 'admin'), createProduct);       // Add product
router.put('/:id', protect, authorize('seller', 'admin'), updateProduct);     // Update product
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);  // Delete product

module.exports = router;