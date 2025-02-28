// const Appointment = require('../models/Appointment');
const Notification = require("../models/Notification");
const User = require('../models/User'); // Assuming doctors & patients are in User model
const schedule = require("node-schedule");


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
    sendNotification,
    getUserNotifications,
    sendPrescriptionReminder,
    getAppointmentReminders,
    sendEmergencyAlert
};
