const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password - Request Reset Link
const forgotPassword = async (req, res) => {
  try {
    const { email, senderEmail, senderPassword } = req.body;  // User provides sender email & password
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000; // 1-hour expiry
    await user.save();

    // Set up dynamic email transport using sender's credentials
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: senderEmail,   // User-provided sender email
        pass: senderPassword, // User-provided sender password
      },
    });

    // Send reset email
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: senderEmail,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset password link sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Hash the token to match the one in the database
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching token and check expiration
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateUserProfile = async (req, res) => {
  const { name, age, gender, phone, medicalHistory } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, age, gender, phone, medicalHistory },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const analyzeSymptoms = async (req, res) => {
  const { symptoms, age, gender, medicalHistory } = req.body;
  try {
    // Call OpenAI API for diagnosis
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Analyze symptoms: ${symptoms.join(', ')}` }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const diagnosis = response.data.choices[0].message.content;
    res.json({ diagnosis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPossibleConditions = async (req, res) => {
  const { symptoms } = req.body;
  try {
    // Call OpenAI API or a medical database API
    const conditions = ["Migraine", "Dehydration"]; // Example response
    res.json({ conditions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const recommendTreatment = async (req, res) => {
  const { condition, age, gender, medicalHistory } = req.body;
  try {
    // Call OpenAI API for treatment recommendations
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Recommend treatment for ${condition}` }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const treatment = response.data.choices[0].message.content;
    res.json({ treatment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const bookAppointment = async (req, res) => {
  console.log("Received Data:", req.body); // Log request data for debugging

  const { doctorId, date, time, symptoms } = req.body;

  if (!doctorId || !date || !time || !symptoms) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const appointment = await Appointment.create({
      userId: req.user.id,
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
    console.error("Error Booking Appointment:", error);
    res.status(500).json({ error: error.message });
  }
};


const uploadMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.create({
      userId: req.user.id,
      file: req.file.path, // File path from Multer
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { registerUser, loginUser, forgotPassword, resetPassword, uploadMedicalRecord, bookAppointment, recommendTreatment, getPossibleConditions, analyzeSymptoms, updateUserProfile, getUserProfile };
