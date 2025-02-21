const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const appointmentRoutes = require('./routes/appointmentRoutes.js');
const userRoutes = require('./routes/userRoutes');
const medicalRoutes = require('./routes/medicalRoutes.js');
const chatRoutes = require('./routes/chatRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const diagnosisRoutes = require("./routes/diagnosisRoutes"); // Import diagnosis API
const interactionsRoutes = require("./routes/interactionsRoutes");



// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json()); // Parse JSON request bodies

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/chat', chatRoutes); // Chatbot-related routes
app.use('/api/medical', medicalRoutes); // 👈 Make sure this line is present
app.use("/api", diagnosisRoutes);
app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api", interactionsRoutes);



app.use("/api", appointmentRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/doctors', doctorRoutes);



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));