const express = require('express');
const router = express.Router();

// Importar los controladores de autenticación
const {
  register,
  login,
  getMe,
} = require('../controllers/authController');

// Importar el middleware de protección por JWT
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Registrar un nuevo usuario (Cliente o Vendedor)
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Autenticar usuario y obtener token de acceso
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Obtener los datos del perfil del usuario autenticado actual
 * @access  Private (Requiere token JWT válido)
 */
router.get('/me', protect, getMe);

module.exports = router;