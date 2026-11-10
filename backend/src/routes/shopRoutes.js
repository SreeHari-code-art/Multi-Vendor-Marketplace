const express = require('express');
const router = express.Router();

// Importar los controladores de tiendas
const {
  createShop,
  getMyShop,
  updateMyShop,
  getApprovedShops,
  getShopById,
  getAllShopsAdmin,
  updateShopStatusAdmin,
} = require('../controllers/shopController');

// Importar los middlewares de autenticación y control de roles
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

/**
 * @route   GET /api/v1/shops
 * @desc    Obtener lista pública de tiendas aprobadas con paginación y búsqueda
 * @access  Public
 */
router.get('/', getApprovedShops);

/**
 * @route   GET /api/v1/shops/seller/me
 * @desc    Obtener el perfil de la tienda del vendedor autenticado
 * @access  Private (Seller)
 * 
 * NOTA: Esta ruta DEBE declararse antes de '/:id' para evitar conflictos de enrutamiento.
 */
router.get('/seller/me', protect, restrictTo('seller'), getMyShop);

/**
 * @route   POST /api/v1/shops
 * @desc    Crear una nueva tienda para el vendedor autenticado
 * @access  Private (Seller)
 */
router.post('/', protect, restrictTo('seller'), createShop);

/**
 * @route   PUT /api/v1/shops/seller/me
 * @desc    Actualizar la información de la tienda del vendedor
 * @access  Private (Seller)
 */
router.put('/seller/me', protect, restrictTo('seller'), updateMyShop);

/**
 * @route   GET /api/v1/shops/admin/all
 * @desc    Obtener todas las tiendas (Panel de Administración)
 * @access  Private (Admin)
 * 
 * NOTA: Declarada antes de '/:id' por la misma regla de precedencia de Express.
 */
router.get('/admin/all', protect, restrictTo('admin'), getAllShopsAdmin);

/**
 * @route   PUT /api/v1/shops/admin/:id/status
 * @desc    Actualizar el estado de verificación/aprobación de una tienda
 * @access  Private (Admin)
 */
router.put('/admin/:id/status', protect, restrictTo('admin'), updateShopStatusAdmin);

/**
 * @route   GET /api/v1/shops/:id
 * @desc    Obtener una tienda específica por su ID junto con sus productos activos
 * @access  Public
 */
router.get('/:id', getShopById);

module.exports = router;