// models/MedicalRecord.js
const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    mimetype: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
