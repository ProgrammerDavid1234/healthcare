const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Using bcryptjs instead of bcrypt

// Doctor Registration

const registerDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, experience, phone } = req.body;

        // Check if doctor already exists
        let doctor = await Doctor.findOne({ email });
        if (doctor) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new doctor
        doctor = new Doctor({ name, email, password: hashedPassword, specialization, experience, phone });
        await doctor.save();

        res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (error) {
        console.error('Error in registerDoctor:', error); // Log the error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Doctor Login
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


// Get Doctor Profile (Protected)
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

const getDoctorDetails = async (req, res) => {
    try {
        const { doctorId } = req.params; // Get doctorId from URL

        // Find the doctor in the database
        const doctor = await Doctor.findById(doctorId).select("name specialization experience phone email");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Format response
        res.status(200).json({
            name: doctor.name,
            specialty: doctor.specialization,
            experience: doctor.experience,
            contactInfo: {
                phone: doctor.phone,
                email: doctor.email
            }
        });

    } catch (error) {
        console.error("Error fetching doctor details:", error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { registerDoctor, loginDoctor, getDoctorProfile, getAvailableDoctors, getDoctorDetails };