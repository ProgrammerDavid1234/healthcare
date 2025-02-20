const MedicalRecord = require('../models/MedicalRecord'); // Import the MedicalRecord model

// Upload Medical Record
const uploadMedicalRecord = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Ensure user ID is available
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user data" });
        }

        // Create a new medical record entry
        const newRecord = await MedicalRecord.create({
            userId: req.user.id,
            filePath: req.file.path,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });

        res.status(201).json({
            message: "File uploaded successfully",
            record: newRecord,
        });
    } catch (error) {
        console.error('Upload Medical Record Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch All Medical Records for a User
const getMedicalRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ userId: req.user.id });

        if (!records.length) {
            return res.status(404).json({ message: "No medical records found" });
        }

        res.status(200).json(records);
    } catch (error) {
        console.error('Get Medical Records Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a Medical Record
const deleteMedicalRecord = async (req, res) => {
    try {
        const recordId = req.params.id;
        const record = await MedicalRecord.findById(recordId);

        if (!record) {
            return res.status(404).json({ message: "Medical record not found" });
        }

        if (record.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this record" });
        }

        await MedicalRecord.findByIdAndDelete(recordId);

        res.status(200).json({ message: "Medical record deleted successfully" });
    } catch (error) {
        console.error('Delete Medical Record Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    uploadMedicalRecord,
    getMedicalRecords,
    deleteMedicalRecord,
};
