const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Customer creates an order
router.post('/', protect, authorize('customer'), createOrder);

// Customer views their own order history
router.get('/my-orders', protect, authorize('customer'), getMyOrders);

// Admin or Seller updates order fulfillment status
router.patch('/:orderId/status', protect, authorize('admin', 'seller'), updateOrderStatus);

module.exports = router;