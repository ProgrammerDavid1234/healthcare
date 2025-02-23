const express = require("express");
const router = express.Router();
const {
    createUser,
    deleteUser,
    getSystemStats,
    getUserMedicalHistory,
    approveDiagnosis,
    addDoctor,
    getPatientReport,
    reviewComplaint
} = require("../controllers/adminController"); // ✅ Make sure this path is correct

// Define routes
router.post("/create-user", createUser);
router.delete("/delete-user/:id", deleteUser);
router.get("/system-stats", getSystemStats);
router.get("/medical-history/:userId", getUserMedicalHistory);
router.post("/diagnosis/approve", approveDiagnosis);
router.post("/add-doctor", addDoctor);
router.get("/patient-report/:patientId", getPatientReport);
router.post("/review-complaint", reviewComplaint);

module.exports = router;
