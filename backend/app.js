require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require("node-cron");

const User = require("./models/User");

// Load environment variables
console.log('Loaded MongoDB URI:', process.env.MONGO_URI);

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MongoDB URI is undefined. Check your .env file!");
  process.exit(1);
}

console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/medical', require('./routes/medicalRoutes'));
app.use("/api/diagnosis", require("./routes/diagnosisRoutes"));
app.use("/api/interactions", require("./routes/interactionsRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/subscription", require("./routes/subscriptionRoutes"));  // ✅ Fixed route name
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use('/uploads', express.static('uploads'));

// Cron Job: Reset Appointments Count Monthly
cron.schedule("0 0 1 * *", async () => {
  try {
    await User.updateMany({}, { $set: { appointmentsCount: 0 } });
    console.log("✅ Reset appointment counts for all users");
  } catch (error) {
    console.error("❌ Error resetting appointment counts:", error);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
