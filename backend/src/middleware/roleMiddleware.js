/**
 * Middleware para restringir el acceso a rutas según los roles permitidos.
 * Nota: Debe utilizarse SIEMPRE después del `authMiddleware` (protect).
 * 
 * @param {...string} roles - Lista de roles permitidos (ej: 'admin', 'seller')
 * @returns {Function} Middleware de Express
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // 1. Verificar si el usuario está autenticado y existe en el request
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado, no se encontró información de rol o usuario',
      });
    }

    // 2. Comprobar si el rol del usuario está incluido en los roles permitidos
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. El rol '${req.user.role}' no tiene permisos para realizar esta acción`,
      });
    }

    // 3. Si el rol es válido, continuar con la siguiente función o controlador
    next();
  };
};

module.exports = { restrictTo };