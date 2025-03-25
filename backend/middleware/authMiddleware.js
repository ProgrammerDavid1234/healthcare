const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const authMiddleware = async (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1]; // Remove "Bearer " prefix
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token belongs to a User or Doctor
        let user = await User.findById(decoded.id).select('-password');
        let doctor = await Doctor.findById(decoded.id).select('-password');

        if (user) {
            req.user = user; // Attach user to request
            req.role = 'user'; // Identify as a user
        } else if (doctor) {
            req.user = doctor; // Attach doctor to request
            req.role = 'doctor'; // Identify as a doctor
        } else {
            return res.status(404).json({ message: 'User or Doctor not found' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const protect = asyncHandler(async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        token = token.split(' ')[1]; // Extract token from "Bearer <token>"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
const adminAuth = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "moderator")) {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};

const restrictPremiumFeatures = async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }
  
    // Ensure subscription is active and not expired
    if (
      req.user.subscriptionStatus !== "active" || 
      new Date(req.user.subscriptionEndDate) < new Date()
    ) {
      return res.status(403).json({ error: "Upgrade your subscription to access this feature." });
    }
  
    next(); // ✅ Allow access if subscription is valid
  };
  
  
  
// ✅ Correct export (no overwriting)
module.exports = { authMiddleware, protect, restrictPremiumFeatures };
