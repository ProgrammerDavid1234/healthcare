const mongoose = require("mongoose"); // ✅ Keep only ONE import
const Appointment = require("../models/Appointment");  // Ensure correct path
const Notification = require("../models/Notification");  // ✅ Ensure it's correctly imported
const User = require("../models/User");  // ✅ Needed for doctor details
const schedule = require("node-schedule");
const Doctor = require("../models/Doctor");  // ✅ Import the correct model




const bookAppointment = async (req, res) => {
    try {
        console.log("📌 Booking Appointment - Request Body:", req.body);
        console.log("📌 User from Token:", req.user);

        if (!req.body.doctorName || !req.body.date || !req.body.time) {
            console.log("❌ Missing fields");
            return res.status(400).json({ message: "All fields are required" });
        }

        const doctor = await Doctor.findOne({ name: req.body.doctorName });
        console.log("📌 Doctor Found:", doctor);

        if (!doctor) {
            console.log("❌ Doctor not found");
            return res.status(404).json({ message: "Doctor not found" });
        }

        console.log("✅ Booking appointment...");
        const appointment = await Appointment.create(req.body);
        console.log("✅ Appointment Created:", appointment);

        res.status(201).json({ message: "Appointment booked", appointment });
    } catch (error) {
        console.error("❌ Error booking appointment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



const getAppointments = async (req, res) => {
    try {
        console.log("📢 Received request to get appointments"); // Add this
        console.log("🟡 User ID from token:", req.user?.id); // Log user ID

        let userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. No user ID found." });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format." });
        }

        console.log("🔵 Fetching Appointments for userId:", userId);
        const appointments = await Appointment.find({ userId: new mongoose.Types.ObjectId(userId) });

        console.log("🟢 Appointments Found:", appointments);

        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found for this user." });
        }

        res.status(200).json({
            message: "Appointments retrieved successfully.",
            appointments,
        });
    } catch (error) {
        console.error("❌ Error fetching appointments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        await Appointment.findByIdAndDelete(id);

        res.status(200).json({ message: "Appointment canceled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { newDate, newTime } = req.body;

        if (!newDate || !newTime) {
            return res.status(400).json({ message: "New date and time are required." });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { date: newDate, time: newTime },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        res.json({ message: "Appointment rescheduled successfully", appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while rescheduling.", error: error.message });
    }
};



const getUpcomingAppointments = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated request
        const today = new Date();

        const appointments = await Appointment.find({
            userId: userId,
            date: { $gte: today } // Fetch only future appointments
        }).sort({ date: 1, time: 1 }); // Sort by date & time

        res.status(200).json({ message: "Upcoming appointments retrieved", appointments });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.user.id; // The authenticated doctor

        // Ensure the requesting user is a doctor
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(403).json({ message: "Access denied. Not a doctor." });
        }

        // Fetch all appointments where this doctor is assigned
        const appointments = await Appointment.find({ doctorId })
            .sort({ date: 1, time: 1 }) // Sort by upcoming first
            .populate("userId", "name email"); // Include patient details

        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found." });
        }

        res.status(200).json({
            message: "Appointments retrieved successfully",
            appointments,
        });
    } catch (error) {
        console.error("❌ Error fetching doctor's appointments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = { bookAppointment, getAppointments, cancelAppointment, rescheduleAppointment, getUpcomingAppointments, getDoctorAppointments };