const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not found: ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for ${err.path}`;
  } else if (err.code === 11000) {
    status = 400;
    message = `${Object.keys(err.keyValue || {}).join(', ') || 'Value'} already exists`;
  }
  res.status(status).json({ message });
};

module.exports = { asyncHandler, notFound, errorHandler };
