const express = require('express');
const { registerDoctor, loginDoctor, getDoctorProfile, getAvailableDoctors, getDoctorDetails, updateDoctor } = require('../controllers/doctorController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/profile', authMiddleware, getDoctorProfile); // Use authMiddleware
router.get("/available", getAvailableDoctors);
router.get('/:doctorId', getDoctorDetails); // ✅ Route to fetch doctor details
router.put('/update/:doctorId', updateDoctor);



module.exports = router;
