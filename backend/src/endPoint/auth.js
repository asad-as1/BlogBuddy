// controllers/authController.js
const isAuthenticated = require('../middlewares/auth');

exports.checkAuth = (req, res) => {
  res.status(200).json({ message: 'Authenticated', user: req.user });
};
