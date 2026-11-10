const express = require('express');
const router = express.Router();

// Importar los controladores de productos
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
} = require('../controllers/productController');

// Importar los middlewares de autenticación y control de roles
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

/**
 * @route   GET /api/v1/products
 * @desc    Obtener lista de productos públicos con filtros, búsqueda y paginación
 * @access  Public
 */
router.get('/', getProducts);

/**
 * @route   GET /api/v1/products/seller/my-products
 * @desc    Obtener todos los productos de la tienda del vendedor autenticado
 * @access  Private (Seller)
 * 
 * NOTA: Esta ruta DEBE declararse antes de '/:id' para evitar que Express 
 * interprete la palabra "seller" como si fuera un ID de MongoDB.
 */
router.get('/seller/my-products', protect, restrictTo('seller'), getSellerProducts);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Obtener un producto específico por su ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/v1/products
 * @desc    Crear un nuevo producto
 * @access  Private (Seller con tienda aprobada o Admin)
 */
router.post('/', protect, restrictTo('seller', 'admin'), createProduct);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Actualizar un producto existente
 * @access  Private (Seller dueño de la tienda o Admin)
 */
router.put('/:id', protect, restrictTo('seller', 'admin'), updateProduct);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Eliminar un producto
 * @access  Private (Seller dueño de la tienda o Admin)
 */
router.delete('/:id', protect, restrictTo('seller', 'admin'), deleteProduct);

module.exports = router;