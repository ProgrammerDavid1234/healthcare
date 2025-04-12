require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const http = require('http');
const { Server } = require('socket.io');

const User = require('./models/User');

// Initialize Express app
const app = express();
const server = http.createServer(app); // Create HTTP server from express

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


app.set('io', io); // Expose io to use in controllers

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MongoDB URI is undefined. Check your .env file!');
  process.exit(1);
}

console.log('🌐 Connecting to MongoDB...');
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/medical', require('./routes/medicalRoutes'));
app.use('/api/diagnosis', require('./routes/diagnosisRoutes'));
app.use('/api/interactions', require('./routes/interactionsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/uploads', express.static('uploads'));

// Cron Job: Reset Appointments Count Monthly
cron.schedule('0 0 1 * *', async () => {
  try {
    await User.updateMany({}, { $set: { appointmentsCount: 0 } });
    console.log('✅ Reset appointment counts for all users');
  } catch (error) {
    console.error('❌ Error resetting appointment counts:', error);
  }
});

// Socket.IO handlers
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`🟢 User/Doctor joined room: ${userId}`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, chatId, content, senderModel, receiverModel } = data;

      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        chatId,
        content,
        senderModel,
        receiverModel,
      });

      await message.save();

      // Emit message to receiver and sender (real-time update)
      io.to(receiverId).emit('receiveMessage', message);
      socket.emit('messageSaved', message);
    } catch (error) {
      console.error('❌ Error saving message:', error.message);
      socket.emit('errorMessage', { message: "Failed to send message" });
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
