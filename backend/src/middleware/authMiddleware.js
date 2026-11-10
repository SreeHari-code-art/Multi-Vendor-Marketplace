const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware para proteger rutas que requieren autenticación mediante JWT.
 */
const protect = async (req, res, next) => {
  let token;

  // Verificar si la cabecera de autorización existe y comienza con "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Extraer el token separando "Bearer" del token real
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificar y decodificar el token usando la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Buscar al usuario en la base de datos usando el ID del token
      // Excluimos la contraseña por seguridad con .select('-password')
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado, el usuario asociado a este token ya no existe',
        });
      }

      // 4. Continuar con la ejecución de la siguiente función o controlador
      next();
    } catch (error) {
      console.error('Error de autenticación:', error.message);
      
      let message = 'No autorizado, token inválido';
      if (error.name === 'TokenExpiredError') {
        message = 'No autorizado, el token ha expirado';
      }

      return res.status(401).json({
        success: false,
        message,
      });
    }
  }

  // Si no se proporcionó ningún token en las cabeceras
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado, no se proporcionó ningún token de acceso',
    });
  }
};

module.exports = { protect };