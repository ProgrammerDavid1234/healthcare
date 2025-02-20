const jwt = require('jsonwebtoken');
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

const protect = (req, res, next) => {
    if (req.user) {
        next(); // User is authenticated, proceed to the next middleware/route handler
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
};

// ✅ Correct export (no overwriting)
module.exports = { authMiddleware, protect };
