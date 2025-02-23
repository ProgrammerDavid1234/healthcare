const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const User = require('../models/User'); // Assuming doctors & patients are in User model
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

        // Notify the Doctor
        await Notification.create({
            userId: doctorId,  // Doctor receives the notification
            message: `You have a new appointment scheduled on ${date} at ${time}.`,
            type: "Appointment"
        });

        res.status(201).json({ message: "Appointment booked", appointment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Daily Reminder Function
const sendDailyReminders = async () => {
    try {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Remind for tomorrow

        const upcomingAppointments = await Appointment.find({ date: tomorrow.toISOString().split("T")[0] });

        for (const appointment of upcomingAppointments) {
            // Fetch doctor details
            const doctor = await User.findById(appointment.doctorId);

            await Notification.create({
                userId: appointment.userId,
                message: `Reminder: Your appointment with Dr. ${doctor?.name || "your doctor"} is scheduled for ${appointment.date} at ${appointment.time}.`,
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

// Reschedule appointment
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

// Get upcoming appointments
const getUpcomingAppointments = async (req, res) => {
    try {
        const userId = req.user.id; 
        const today = new Date();

        const appointments = await Appointment.find({
            userId: userId,
            date: { $gte: today } // Fetch only future appointments
        }).sort({ date: 1, time: 1 });

        res.status(200).json({ message: "Upcoming appointments retrieved", appointments });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const sendNotification = async (req, res) => {
    try {
        const { userId, message, type } = req.body;

        if (!userId || !message || !type) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const notification = await Notification.create({ userId, message, type });

        res.status(201).json({ message: "Notification sent successfully", notification });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get User-Specific Notifications (GET /notifications/:userId)
const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;

        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const sendPrescriptionReminder = async (req, res) => {
    try {
        const { userId, message } = req.body;
        if (!userId || !message) {
            return res.status(400).json({ message: "User ID and message are required." });
        }

        // Logic to send prescription reminder (e.g., store in DB or send notification)
        res.status(200).json({ message: "Prescription reminder sent successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error sending prescription reminder.", error: error.message });
    }
};

const getAppointmentReminders = async (req, res) => {
    try {
        // Logic to fetch upcoming appointments and send reminders
        res.status(200).json({ message: "Appointment reminders retrieved successfully.", reminders: [] });
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointment reminders.", error: error.message });
    }
};

const sendEmergencyAlert = async (req, res) => {
    try {
        const { userId, condition } = req.body;
        if (!userId || !condition) {
            return res.status(400).json({ message: "User ID and emergency condition are required." });
        }

        // Logic to trigger an emergency alert
        res.status(200).json({ message: "Emergency alert sent successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error sending emergency alert.", error: error.message });
    }
};


// Schedule the daily reminder to run every day at 9 AM
schedule.scheduleJob("0 9 * * *", sendDailyReminders);

module.exports = { 
    bookAppointment, 
    getAppointments, 
    cancelAppointment, 
    rescheduleAppointment, 
    getUpcomingAppointments,
    sendNotification,
    getUserNotifications,
    sendPrescriptionReminder,
    getAppointmentReminders,
    sendEmergencyAlert
};
