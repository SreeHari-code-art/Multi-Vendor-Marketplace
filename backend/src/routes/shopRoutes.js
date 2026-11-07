const express = require('express');
const router = express.Router();
const { createShop, updateVerificationStatus } = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Seller creates their shop
router.post('/create', protect, authorize('seller', 'admin'), createShop);

// Admin updates shop verification status
router.patch('/:shopId/verify', protect, authorize('admin'), updateVerificationStatus);

module.exports = router;