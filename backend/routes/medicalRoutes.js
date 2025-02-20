const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadMedicalRecord, getMedicalRecords, deleteMedicalRecord } = require('../controllers/medicalController');
const { protect } = require('../middleware/authMiddleware'); // Ensure this middleware sets req.user

const router = express.Router();

// Ensure 'uploads/' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for single file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Routes
router.post('/uploadMedicalRecord', protect, upload.single('file'), uploadMedicalRecord);
router.get('/medicalRecords', protect, getMedicalRecords);
router.delete('/medicalRecord/:id', protect, deleteMedicalRecord);

module.exports = router;
