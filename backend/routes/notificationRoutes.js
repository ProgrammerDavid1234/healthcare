const express = require("express");
const { sendNotification, getUserNotifications, sendPrescriptionReminder, getAppointmentReminders, sendEmergencyAlert } = require("../controllers/notificationController");

const router = express.Router();

// Send a notification
router.post("/notifications", sendNotification);

// Get user-specific notifications
router.get("/notifications/:userId", getUserNotifications);

// 📌 Route to send prescription reminders
router.post("/reminder", sendPrescriptionReminder);

// 📌 Route to fetch appointment reminders
router.get("/appointments", getAppointmentReminders);

// 📌 Route to send emergency alerts
router.post("/emergency", sendEmergencyAlert);


module.exports = router;
