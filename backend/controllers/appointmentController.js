const Appointment = require('../models/Appointment'); // Import Appointment model

// ✅ Book an Appointment
const bookAnAppointment = async (req, res) => {
    const { doctorId, date, time, symptoms } = req.body;

    try {
        const appointment = await Appointment.create({
            userId: req.user.id, // Assumes authentication middleware sets req.user
            doctorId,
            date,
            time,
            symptoms,
        });

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get Appointments for Logged-in User
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id }).populate('doctorId', 'name specialty');

        if (!appointments.length) {
            return res.status(404).json({ message: "No appointments found" });
        }

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Cancel an Appointment
const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to cancel this appointment" });
        }

        await Appointment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Appointment cancelled successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Export all functions correctly
module.exports = {
    bookAnAppointment,
    getAppointments,
    cancelAppointment,
};
