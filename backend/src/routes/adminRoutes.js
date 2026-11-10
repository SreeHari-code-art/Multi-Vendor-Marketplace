const router = require('express').Router();
const c = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('admin'));
router.get('/stats', c.getStats);
router.get('/users', c.getUsers);
router.put('/users/:id/role', c.updateUserRole);
router.delete('/users/:id', c.deleteUser);
router.get('/shops', c.getShops);
router.put('/shops/:id/verify', c.verifyShop);
router.get('/orders', c.getOrders);

module.exports = router;
