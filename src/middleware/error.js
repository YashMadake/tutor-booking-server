module.exports = (err, _req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: {
      message: err.message || 'Internal server error',
      details: err.details,
    },
  });
};