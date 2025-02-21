const Appointment = require('../models/Appointment'); // Ensure the model exists

const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, symptoms } = req.body;

        // Validate required fields
        if (!doctorId || !date || !time || !symptoms) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create the appointment
        const appointment = await Appointment.create({
            userId: req.user.id, // Get user ID from authentication token
            doctorId,
            date,
            time,
            symptoms
        });

        res.status(201).json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all appointments
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id });

        res.status(200).json({ appointments });
    } catch (error) {
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
