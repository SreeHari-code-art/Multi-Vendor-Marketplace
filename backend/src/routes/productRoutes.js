const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public route to view all products
router.get('/', getAllProducts);

// Protected route: Only sellers (with verified shops) can create products
router.post('/create', protect, authorize('seller', 'admin'), createProduct);

module.exports = router;