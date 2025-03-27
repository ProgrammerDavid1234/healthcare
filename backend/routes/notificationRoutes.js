const express = require("express");
const {
  sendNotification,
  getUserNotifications,
  sendPrescriptionReminder,
  getAppointmentReminders,
  sendEmergencyAlert,
  deleteNotification,  // ✅ Add this import
  deleteAllUserNotifications  // ✅ Add this import
} = require("../controllers/notificationController");  // Make sure it's the correct path

const router = express.Router();

// 📌 Send a notification
router.post("/notifications", sendNotification);

// 📌 Get user-specific notifications
router.get("/notifications/:userId", getUserNotifications);

// 📌 Delete a specific notification by ID
router.delete("/notifications/:notificationId", deleteNotification);

// 📌 Delete all notifications for a user
router.delete("/notifications/user/:userId", deleteAllUserNotifications);

// 📌 Route to send prescription reminders
router.post("/reminder", sendPrescriptionReminder);

// 📌 Route to fetch appointment reminders
router.get("/appointments", getAppointmentReminders);

// 📌 Route to send emergency alerts
router.post("/emergency", sendEmergencyAlert);

module.exports = router;
