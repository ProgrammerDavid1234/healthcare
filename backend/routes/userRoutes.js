const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const MedicalHistory = require("../models/MedicalHistory");
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    getMedicalHistory
} = require('../controllers/userController');

const router = express.Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);

// Protected Routes
router.get('/profile', protect, getUserProfile);

router.put('/update', protect, updateUserProfile, async (req, res) => {
    console.log('User from token:', req.user); // Debugging
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.age = req.body.age || user.age;
        user.gender = req.body.gender || user.gender;
        user.medicalHistory = req.body.medicalHistory
            ? req.body.medicalHistory.split(',')
            : user.medicalHistory;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/medical-history', getMedicalHistory);

module.exports = router;
