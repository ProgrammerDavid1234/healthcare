const express = require('express');
const { bookAnAppointment, getAppointments, cancelAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware


const router = express.Router();

router.post('/book', protect, bookAnAppointment);
router.get('/', protect, getAppointments);
router.delete('/:id', protect, cancelAppointment);

console.log(bookAnAppointment); // Should log the function, not undefined
console.log(getAppointments);   // Should log the function, not undefined
console.log(cancelAppointment); // Should log the function, not undefinedconst { protect } = require('../middleware/authMiddleware');


module.exports = router;