const express = require('express');
const router = express.Router();

// Importar los controladores de pedidos
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

// Importar los middlewares de autenticación y control de roles
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

/**
 * @route   POST /api/v1/orders
 * @desc    Crear un nuevo pedido (Checkout del cliente)
 * @access  Private (Customer)
 */
router.post('/', protect, restrictTo('customer'), createOrder);

/**
 * @route   GET /api/v1/orders/my-orders
 * @desc    Obtener el historial de pedidos del cliente autenticado
 * @access  Private (Customer)
 * 
 * NOTA: Esta ruta DEBE declararse antes de '/:id' para evitar conflictos de enrutamiento.
 */
router.get('/my-orders', protect, restrictTo('customer'), getMyOrders);

/**
 * @route   GET /api/v1/orders/seller/my-shop-orders
 * @desc    Obtener los pedidos que contienen productos de la tienda del vendedor
 * @access  Private (Seller)
 * 
 * NOTA: Declarada antes de '/:id' para que Express no confunda la ruta estática con un parámetro ID.
 */
router.get('/seller/my-shop-orders', protect, restrictTo('seller'), getSellerOrders);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Obtener un pedido específico por su ID (Cliente dueño, Vendedor con ítems o Admin)
 * @access  Private
 */
router.get('/:id', protect, getOrderById);

/**
 * @route   PUT /api/v1/orders/:id/status
 * @desc    Actualizar el estado de un pedido (Procesando, Enviado, Entregado, etc.)
 * @access  Private (Seller dueño del producto o Admin)
 */
router.put('/:id/status', protect, restrictTo('seller', 'admin'), updateOrderStatus);

module.exports = router;