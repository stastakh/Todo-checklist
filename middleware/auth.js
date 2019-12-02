module.exports = function authMiddleware(req, res, next) {
  if (req.headers.authorization === 'authorized') {
    console.log('AUTH SUCCESS');
    next();
  } else {
    const error = { status: 403, message: 'AUTH FAILED' };
    next(error);
  }
};
