require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const appointmentRoutes = require('./routes/appointmentRoutes.js');
const userRoutes = require('./routes/userRoutes');
const medicalRoutes = require('./routes/medicalRoutes.js');
const chatRoutes = require('./routes/chatRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const diagnosisRoutes = require("./routes/diagnosisRoutes");
const interactionsRoutes = require("./routes/interactionsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes.js");

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
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/medical', medicalRoutes);
app.use("/api", diagnosisRoutes);
app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api", interactionsRoutes);
app.use("/api", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", authRoutes);
app.use("/api", appointmentRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/doctors', doctorRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
