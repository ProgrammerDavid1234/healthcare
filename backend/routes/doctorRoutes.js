const express = require('express');
const { registerDoctor, loginDoctor, getDoctorProfile, getAvailableDoctors, getDoctorDetails } = require('../controllers/doctorController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/profile', authMiddleware, getDoctorProfile); // Use authMiddleware
router.get("/available", getAvailableDoctors);
router.get('/:doctorId', getDoctorDetails); // ✅ Route to fetch doctor details



module.exports = router;
