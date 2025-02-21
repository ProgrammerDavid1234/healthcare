const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Create a new doctor (Registration)
const registerDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, experience, phone, location, consultationFee, availability } = req.body;

        let doctor = await Doctor.findOne({ email });
        if (doctor) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        doctor = new Doctor({ name, email, password: hashedPassword, specialization, experience, phone, location, consultationFee, availability });
        await doctor.save();

        res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (error) {
        console.error('Error in registerDoctor:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginDoctor = async (req, res) => {
    const { email, password } = req.body;

    try {
        const doctor = await Doctor.findOne({ email });

        if (!doctor) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: doctor._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: "Doctor logged in successfully",
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                specialization: doctor.specialization,
                token
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getAvailableDoctors = async (req, res) => {
    try {
        // Fetch only available doctors
        const doctors = await Doctor.find({ availability: true }).select("name specialization experience ratings consultationFee location");

        if (!doctors.length) {
            return res.status(404).json({ message: "No available doctors at the moment" });
        }

        res.status(200).json({ doctors });
    } catch (error) {
        console.error("Error fetching available doctors:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Update doctor details
const updateDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params; // Get doctorId from URL
        const updates = req.body; // Get updated fields from request body

        // Find and update the doctor
        const doctor = await Doctor.findByIdAndUpdate(doctorId, updates, { new: true });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ message: "Doctor updated successfully", doctor });
    } catch (error) {
        console.error("Error updating doctor:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select('-password');
        res.status(200).json({ doctors });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single doctor details
const getDoctorDetails = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const doctor = await Doctor.findById(doctorId).select('-password');

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json(doctor);
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const doctor = await Doctor.findByIdAndDelete(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user.id).select('-password');
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



module.exports = { registerDoctor, loginDoctor, updateDoctor, getAllDoctors, getDoctorDetails, deleteDoctor, getAvailableDoctors, getDoctorProfile}
