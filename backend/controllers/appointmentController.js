const mongoose = require("mongoose"); // ✅ Keep only ONE import
const Appointment = require("../models/Appointment");  // Ensure correct path
const Notification = require("../models/Notification");  // ✅ Ensure it's correctly imported
const User = require("../models/User");  // ✅ Needed for doctor details
const schedule = require("node-schedule");
const Doctor = require("../models/Doctor");  // ✅ Import the correct model



const bookAppointment = async (req, res) => {
    try {
      const { userId, doctorName, date, time, reason, symptoms } = req.body;
  
      // Validate required fields
      if (!userId || !doctorName || !date || !time) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // 🔍 Find the user
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // 🔍 Find the doctor
      const doctor = await Doctor.findOne({ name: doctorName });
      if (!doctor) {
        return res.status(404).json({ message: `Doctor '${doctorName}' not found in the database` });
      }
  
      // 🎯 Define appointment limits based on subscription plan
      const planLimits = {
        basic: 5,         // Max 5 appointments per month
        pro: 15,          // Max 15 appointments per month
        enterprise: 9999, // Unlimited
      };
  
      // 🛑 Check if the user has exceeded their appointment limit
      if (user.appointmentsCount >= planLimits[user.subscription.plan]) {
        return res.status(403).json({
          error: "You have reached your appointment limit. Upgrade your plan to book more.",
        });
      }
  
      // 📅 Create the appointment
      const appointment = await Appointment.create({
        userId: user._id,
        doctorId: doctor._id,
        doctorName,
        date,
        time,
        reason,
        symptoms,
      });
  
      // 🔔 Send notifications to both user and doctor
      await Notification.create([
        {
          userId: user._id,
          message: `You have an appointment with Dr. ${doctorName} on ${date} at ${time}.`,
          type: "Appointment",
        },
        {
          userId: doctor._id,
          message: `New appointment booked by ${user.name} on ${date} at ${time}.`,
          type: "Appointment",
        },
      ]);
  
      // 🔄 Increment the user's appointment count
      user.appointmentsCount += 1;
      await user.save();
  
      res.status(201).json({ message: "Appointment booked successfully", appointment });
  
    } catch (error) {
      console.error("❌ Error booking appointment:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };



const getAppointments = async (req, res) => {
    try {
        console.log("🟡 Received User:", req.user);

        // ✅ Extract userId from the authenticated user
        let userId = req.user.id;

        // ✅ Ensure userId exists and is valid
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. No user ID found." });
        }

        // ✅ Convert userId to a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format." });
        }

        console.log("🔵 Fetching Appointments for userId:", userId);
        const appointments = await Appointment.find({ userId: new mongoose.Types.ObjectId(userId) });

        console.log("🟢 Appointments Found:", appointments);

        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found for this user." });
        }

        res.status(200).json({
            message: "Appointments retrieved successfully.",
            appointments,
        });
    } catch (error) {
        console.error("❌ Error fetching appointments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🚀 Deleting appointment with ID:", id);

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        await Appointment.findByIdAndDelete(id);
        console.log("✅ Appointment deleted:", id);

        res.status(200).json({ message: "Appointment canceled successfully" });
    } catch (error) {
        console.error("❌ Error deleting appointment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { newDate, newTime } = req.body;

        if (!newDate || !newTime) {
            return res.status(400).json({ message: "New date and time are required." });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { date: newDate, time: newTime },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        res.json({ message: "Appointment rescheduled successfully", appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while rescheduling.", error: error.message });
    }
};



const getUpcomingAppointments = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated request
        const today = new Date();

        const appointments = await Appointment.find({
            userId: userId,
            date: { $gte: today } // Fetch only future appointments
        }).sort({ date: 1, time: 1 }); // Sort by date & time

        res.status(200).json({ message: "Upcoming appointments retrieved", appointments });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.user.id; // The authenticated doctor

        // Ensure the requesting user is a doctor
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(403).json({ message: "Access denied. Not a doctor." });
        }

        // Fetch all appointments where this doctor is assigned
        const appointments = await Appointment.find({ doctorId })
            .sort({ date: 1, time: 1 }) // Sort by upcoming first
            .populate("userId", "name email"); // Include patient details

        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found." });
        }

        res.status(200).json({
            message: "Appointments retrieved successfully",
            appointments,
        });
    } catch (error) {
        console.error("❌ Error fetching doctor's appointments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = { bookAppointment, getAppointments, cancelAppointment, rescheduleAppointment, getUpcomingAppointments, getDoctorAppointments };
