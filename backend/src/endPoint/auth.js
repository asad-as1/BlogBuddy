// src/controllers/authController.js
exports.checkAuth = (req, res) => {
  res.status(200).json({ message: 'Authenticated', user: req.user });
};
