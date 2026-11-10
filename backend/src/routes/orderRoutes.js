const router = require('express').Router();
const c = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.post('/', authorize('customer'), c.createOrder);
router.get('/my', authorize('customer'), c.getMyOrders);
router.get('/seller', authorize('seller'), c.getSellerOrders);
router.put('/:id/status', authorize('seller'), c.updateOrderStatus);

module.exports = router;
