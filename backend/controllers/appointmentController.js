const Appointment = require("../models/Appointment");  // ✅ Check Path
const Notification = require("../models/Notification");  // ✅ Ensure it's correctly imported
const User = require("../models/User");  // ✅ Needed for doctor details
const schedule = require("node-schedule");


const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, reason, symptoms } = req.body;

        if (!doctorId || !date || !time) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const appointment = await Appointment.create({
            userId: req.user.id,  // Patient ID from token
            doctorId,
            date,
            time,
            reason,
            symptoms
        });

        // ✅ Ensure Notification Model is Available Before Using It
        if (!Notification) {
            return res.status(500).json({ message: "Notification model not found" });
        }

        try {
            await Notification.create({
                userId: doctorId,  // Doctor receives the notification
                message: `You have a new appointment scheduled on ${date} at ${time}.`,
                type: "Appointment"
            });
        } catch (notifyError) {
            console.error("Error creating notification:", notifyError);
        }

        res.status(201).json({ message: "Appointment booked", appointment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const sendDailyReminders = async () => {
    try {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Next day's reminders

        const upcomingAppointments = await Appointment.find({ date: tomorrow.toISOString().split("T")[0] });

        for (const appointment of upcomingAppointments) {
            await Notification.create({
                userId: appointment.userId,
                message: `Reminder: Your appointment with Dr. ${appointment.doctorId} is scheduled for ${appointment.date} at ${appointment.time}.`,
                type: "Reminder"
            });
        }
        console.log("Daily reminders sent successfully.");
    } catch (error) {
        console.error("Error sending reminders:", error);
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
schedule.scheduleJob("0 9 * * *", sendDailyReminders);
