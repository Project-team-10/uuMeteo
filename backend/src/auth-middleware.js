module.exports = function authMiddleware(req, res, next) {
  if (req.isAuthenticated() === false) {
    return res.status(401).json({ message: "User not logged in" });
  }
  next();
};
