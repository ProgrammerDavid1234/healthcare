const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updateUserProfile
} = require('../controllers/userController');

const router = express.Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);

// Protected Routes
router.get('/profile', protect, getUserProfile);
router.put('/update', protect, updateUserProfile);

module.exports = router;
