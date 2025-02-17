const express = require('express');
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword, // Ensure this is included
} = require('../controllers/userController');

const router = express.Router();

// Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword); // This was missing before `module.exports`

module.exports = router; // Ensure all routes are included before exporting
