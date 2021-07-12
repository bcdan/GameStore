const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const { ensureNotAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', ensureNotAuthenticated,UsersController.getLoginPage );

// Register Page
router.get('/register',ensureNotAuthenticated, UsersController.getRegisterPage );

// Register
router.post('/register', ensureNotAuthenticated, UsersController.registerUser);

//login handle
router.post('/login',ensureNotAuthenticated, UsersController.handleLogin);

//logout handle
router.get('/logout', UsersController.handleLogout);


module.exports = router;
