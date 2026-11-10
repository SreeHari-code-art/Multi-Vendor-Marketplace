const router = require('express').Router();
const c = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', c.getShops);
router.get('/me', protect, authorize('seller'), c.getMyShop); // must come before '/:id'
router.put('/me', protect, authorize('seller'), c.updateMyShop);
router.get('/:id', c.getShop);

module.exports = router;
