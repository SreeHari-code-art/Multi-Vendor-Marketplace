exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error(`Role '${req.user.role}' cannot access this resource`));
  }
  next();
};
