const User = require("../models/User");
const Appointment = require("../models/Appointment");

// ✅ Admin creates a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = await User.create({ name, email, password, role });
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Admin deletes a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Admin retrieves system stats
const getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDoctors = await User.countDocuments({ role: "doctor" });
        const totalAppointments = await Appointment.countDocuments();

        res.status(200).json({
            message: "System stats retrieved",
            stats: { totalUsers, totalDoctors, totalAppointments },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Admin views a user's medical history
const getUserMedicalHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const appointments = await Appointment.find({ userId }).sort({ date: -1 });

        if (!appointments.length) {
            return res.status(404).json({ message: "No medical history found for this user." });
        }

        res.status(200).json({ message: "Medical history retrieved", history: appointments });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Approve a diagnosis
const approveDiagnosis = async (req, res) => {
    try {
        const { diagnosisId, status } = req.body;
        if (!diagnosisId || !status) {
            return res.status(400).json({ message: "Diagnosis ID and status are required." });
        }
        // Logic to update diagnosis approval
        res.status(200).json({ message: "Diagnosis approved successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error approving diagnosis.", error: error.message });
    }
};

// ✅ Add a doctor
const addDoctor = async (req, res) => {
    try {
        const { name, specialty, email, phone } = req.body;
        if (!name || !specialty || !email || !phone) {
            return res.status(400).json({ message: "All doctor details are required." });
        }
        // Logic to add doctor
        res.status(201).json({ message: "Doctor added successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error adding doctor.", error: error.message });
    }
};

// ✅ Get patient report
const getPatientReport = async (req, res) => {
    try {
        const { patientId } = req.params;
        // Logic to fetch patient report
        res.status(200).json({ message: "Patient report retrieved.", data: {} });
    } catch (error) {
        res.status(500).json({ message: "Error fetching report.", error: error.message });
    }
};
    
// ✅ Review complaints
const reviewComplaint = async (req, res) => {
    try {
        const { complaintId, resolution } = req.body;
        if (!complaintId || !resolution) {
            return res.status(400).json({ message: "Complaint ID and resolution are required." });
        }
        // Logic to review complaint
        res.status(200).json({ message: "Complaint reviewed successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error reviewing complaint.", error: error.message });
    }
};

module.exports = { 
    createUser, 
    deleteUser, 
    getSystemStats, 
    getUserMedicalHistory, 
    approveDiagnosis, 
    addDoctor, 
    getPatientReport, 
    reviewComplaint 
};
