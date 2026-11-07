/**
 * Middleware to restrict access based on user roles
 * @param  {...string} allowedRoles - Roles allowed to access the route (e.g., 'admin', 'seller', 'customer')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Ensure authMiddleware has already run and attached req.user
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Unauthorized: Authentication required before authorization' 
      });
    }

    // 2. Check if the user's role is included in the allowed roles list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: Your role ('${req.user.role}') is not authorized to access this route.`
      });
    }

    // 3. User is authorized, proceed to the next middleware or controller
    next();
  };
};

module.exports = { authorize };