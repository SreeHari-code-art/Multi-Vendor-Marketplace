const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Función auxiliar para generar un Token JWT firmado
 * @param {string} id - ID del usuario de MongoDB
 * @returns {string} Token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * @desc    Registrar un nuevo usuario (Cliente o Vendedor)
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Verificar si el usuario ya se encuentra registrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado en el sistema',
      });
    }

    // 2. Crear el usuario en la base de datos
    // (El hashing de contraseña se ejecuta automáticamente mediante el hook pre-save del modelo User)
    const user = await User.create({
      name,
      email,
      password,
      role: role && ['customer', 'seller'].includes(role) ? role : 'customer',
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          shop: user.shop,
          avatar: user.avatar,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Datos de usuario inválidos',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Autenticar usuario y obtener token (Login)
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validar que se envíen los campos obligatorios
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, proporcione un correo electrónico y una contraseña',
      });
    }

    // 2. Buscar al usuario y traer explícitamente la contraseña (que tiene select: false por defecto)
    // También poblamos la tienda asociada si el usuario es un vendedor
    const user = await User.findOne({ email }).select('+password').populate('shop');

    // 3. Validar existencia del usuario y coincidencia de contraseña
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        token: generateToken(user._id),
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          shop: user.shop,
          avatar: user.avatar,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas (correo o contraseña incorrectos)',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener los datos del perfil del usuario autenticado actual
 * @route   GET /api/v1/auth/me
 * @access  Private (Requiere authMiddleware)
 */
const getMe = async (req, res, next) => {
  try {
    // req.user ya viene adjunto y sin contraseña gracias al middleware 'protect'
    const user = await User.findById(req.user._id).populate('shop');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};