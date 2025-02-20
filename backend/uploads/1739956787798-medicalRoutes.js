const express = require('express');
const multer = require('multer');
const { uploadMedicalRecord } = require('../controllers/medicalController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Store files in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file naming
    }
});

const upload = multer({ storage });

// Allow any field name for file upload
router.post('/uploadMedicalRecord', protect, upload.any(), uploadMedicalRecord);

module.exports = router;
