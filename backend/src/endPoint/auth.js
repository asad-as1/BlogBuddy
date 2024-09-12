const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/auth');

router.get('/check-auth', isAuthenticated, (req, res) => {
  res.status(200).json({ message: 'Authenticated', user: req.user });
});

module.exports = router;
