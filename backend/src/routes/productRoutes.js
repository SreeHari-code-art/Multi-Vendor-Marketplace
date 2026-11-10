const router = require('express').Router();
const c = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', c.getProducts);
router.get('/categories', c.getCategories);
router.get('/mine', protect, authorize('seller'), c.getMyProducts); // must come before '/:id'
router.get('/:id', c.getProduct);

router.post('/', protect, authorize('seller'), c.createProduct);
router.put('/:id', protect, authorize('seller'), c.updateProduct);
router.delete('/:id', protect, authorize('seller'), c.deleteProduct);

module.exports = router;
