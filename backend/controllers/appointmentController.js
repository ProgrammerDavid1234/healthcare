const mongoose = require("mongoose"); // ✅ Keep only ONE import
const Appointment = require("../models/Appointment");  // Ensure correct path
const Notification = require("../models/Notification");  // ✅ Ensure it's correctly imported
const User = require("../models/User");  // ✅ Needed for doctor details
const schedule = require("node-schedule");



const bookAppointment = async (req, res) => {
    try {
        const { doctorName, date, time, reason, symptoms } = req.body;

        if (!doctorName || !date || !time) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 🔵 Find the doctor in the database
        const doctor = await User.findOne({ name: doctorName });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // 🔵 Create appointment
        const appointment = await Appointment.create({
            userId: req.user.id,  // Patient ID
            doctorName,
            date,
            time,
            reason,
            symptoms
        });

        // 🔵 Create notifications for both doctor and patient
        await Notification.create([
            {
                userId: req.user.id, // Patient notification
                message: `Your appointment with Dr. ${doctorName} is confirmed for ${date} at ${time}.`,
                type: "Appointment"
            },
            {
                userId: doctor._id, // Doctor notification
                message: `You have a new appointment scheduled with a patient on ${date} at ${time}.`,
                type: "Appointment"
            }
        ]);

        res.status(201).json({ message: "Appointment booked", appointment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




const getAppointments = async (req, res) => {
    try {
        console.log("🟡 Received User:", req.user);

        // ✅ Extract userId from the authenticated user
        let userId = req.user.id;

        // ✅ Ensure userId exists and is valid
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. No user ID found." });
        }

        // ✅ Convert userId to a valid ObjectId
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

        const appointment = await Appointment.findByIdAndDelete(id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment canceled" });
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

module.exports = { bookAppointment, getAppointments, cancelAppointment, rescheduleAppointment, getUpcomingAppointments };
