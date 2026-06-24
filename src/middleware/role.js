const ApiError = require('../utils/ApiError');

module.exports = (...allowed) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated'));
  if (!allowed.includes(req.user.role)) {
    return next(new ApiError(403, `Requires role: ${allowed.join(' or ')}`));
  }
  next();
};