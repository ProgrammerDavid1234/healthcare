const express = require('express');
const { bookAppointment, getAppointments, cancelAppointment, rescheduleAppointment, getUpcomingAppointments } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware


const router = express.Router();

router.post("/appointments", protect, bookAppointment);
router.get('/', protect, getAppointments);
router.delete("/appointments/:id", cancelAppointment);
router.put("/appointments/:id/reschedule", protect, rescheduleAppointment);

// Route to fetch upcoming appointments
router.get('/upcoming', protect, getUpcomingAppointments);



console.log(bookAppointment); // Should log the function, not undefined
console.log(getAppointments);   // Should log the function, not undefined
console.log(cancelAppointment); // Should log the function, not undefinedconst { protect } = require('../middleware/authMiddleware');


module.exports = router;