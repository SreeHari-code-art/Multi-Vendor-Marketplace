const express = require('express');
const router = express.Router();

// Importar los controladores de administración
const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrdersAdmin,
} = require('../controllers/adminController');

// Importar los middlewares de autenticación y control de roles
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

/**
 * Middleware Global del Enrutador:
 * Todas las rutas declaradas en este archivo están protegidas y 
 * restringidas exclusivamente a usuarios con rol de Administrador ('admin').
 */
router.use(protect, restrictTo('admin'));

/**
 * @route   GET /api/v1/admin/stats
 * @desc    Obtener estadísticas generales y financieras del marketplace
 * @access  Private (Admin)
 */
router.get('/stats', getAdminStats);

/**
 * @route   GET /api/v1/admin/users
 * @desc    Obtener la lista completa de todos los usuarios registrados
 * @access  Private (Admin)
 */
router.get('/users', getAllUsers);

/**
 * @route   PUT /api/v1/admin/users/:id/role
 * @desc    Actualizar el rol de un usuario específico (customer, seller, admin)
 * @access  Private (Admin)
 */
router.put('/users/:id/role', updateUserRole);

/**
 * @route   DELETE /api/v1/admin/users/:id
 * @desc    Eliminar un usuario del sistema (incluyendo su tienda y productos si es vendedor)
 * @access  Private (Admin)
 */
router.delete('/users/:id', deleteUser);

/**
 * @route   GET /api/v1/admin/orders
 * @desc    Obtener una visión global de todos los pedidos realizados en cualquier tienda
 * @access  Private (Admin)
 */
router.get('/orders', getAllOrdersAdmin);

module.exports = router;