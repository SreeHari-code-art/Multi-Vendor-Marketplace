const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Example: Only a Seller can create a product
router.post('/create', protect, authorize('seller', 'admin'), (req, res) => {
  res.json({ message: 'Product created successfully by authorized seller/admin' });
});

// Example: Only an Admin can view all system users
router.get('/admin/users', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'List of all users (Admin view)' });
});

module.exports = router;