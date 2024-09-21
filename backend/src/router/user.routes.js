const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth'); 
const isAuthenticated = require("../endPoint/auth")

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/check-auth', authenticate, isAuthenticated);
router.post('/logout', userController.logout);
router.get('/profile', authenticate, userController.getProfile);
router.get('/profile/:username', authenticate, userController.getUsername);
router.post('/getUserById', userController.getUserById);
router.put('/profile', authenticate, userController.updateProfile);
router.delete('/delete', authenticate, userController.deleteUser);
router.get('/favourites', authenticate, userController.fetchFavourites);
router.get('/removeFavourites/:postId', authenticate, userController.RemoveFromFavorites);
router.get('/favourites/:postId', authenticate, userController.addPostToFavorites);
router.get('/favourites/check/:postId', authenticate, userController.isPostInFavourites);
router.get('/search', authenticate, userController.searchUsers);

module.exports = router;