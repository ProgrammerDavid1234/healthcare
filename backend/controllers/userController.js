const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');


// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role, medicalHistory, prescriptions } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "patient", // Default role to "patient" if not provided
      medicalHistory: medicalHistory ? medicalHistory.split(',').map(item => item.trim()) : [],
      prescriptions: prescriptions ? prescriptions.split(',').map(item => item.trim()) : []
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Login an existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a fresh token with a unique `timestamp`
    const token = jwt.sign(
      { id: user._id, timestamp: Date.now() }, // Timestamp ensures uniqueness
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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


const updateUserProfile = asyncHandler(async (req, res) => {
  console.log("User from token:", req.user);

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized: No user found in token" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update fields
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  user.age = req.body.age || user.age;
  user.gender = req.body.gender || user.gender;
  user.role = req.body.role || user.role;
  user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
  user.address = req.body.address || user.address;
  user.bloodType = req.body.bloodType || user.bloodType;
  user.emergencyContact = req.body.emergencyContact || user.emergencyContact;

  // Handle arrays correctly
  if (req.body.allergies) {
    user.allergies = Array.isArray(req.body.allergies)
      ? req.body.allergies
      : req.body.allergies.split(',').map(item => item.trim());
  }

  if (req.body.currentMedication) {
    user.currentMedication = Array.isArray(req.body.currentMedication)
      ? req.body.currentMedication
      : req.body.currentMedication.split(',').map(item => item.trim());
  }

  if (req.body.medicalHistory) {
    user.medicalHistory = Array.isArray(req.body.medicalHistory)
      ? req.body.medicalHistory
      : req.body.medicalHistory.split(',').map(item => item.trim());
  }

  if (req.body.prescriptions) {
    user.prescriptions = Array.isArray(req.body.prescriptions)
      ? req.body.prescriptions
      : req.body.prescriptions.split(',').map(item => item.trim());
  }

  // Update password securely
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  // Save user and handle errors
  try {
    const updatedUser = await user.save();
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

const getMedicalHistory = async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters
  try {
    const user = await User.findById(userId).select('medicalHistory');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ medicalHistory: user.medicalHistory });
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
module.exports = { registerUser, loginUser, forgotPassword, resetPassword, uploadMedicalRecord, bookAppointment, recommendTreatment, getPossibleConditions, analyzeSymptoms, updateUserProfile, getUserProfile, getMedicalHistory };
