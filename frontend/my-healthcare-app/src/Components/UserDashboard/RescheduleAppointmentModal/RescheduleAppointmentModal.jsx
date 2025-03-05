import React, { useState } from "react";
import styles from "./RescheduleAppointmentModal.module.css";
import axios from "axios";

const RescheduleAppointmentModal = ({ isOpen, onClose, appointmentId, token, onReschedule }) => {
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newDate || !newTime) {
            alert("Please select a new date and time.");
            return;
        }

        try {
            const response = await axios.put(
                `https://healthcare-backend-a66n.onrender.com/api/appointments/${appointmentId}/reschedule`,
                { date: newDate, time: newTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            onReschedule(response.data.updatedAppointment);
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to reschedule appointment");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Reschedule Appointment</h3>
                <form onSubmit={handleSubmit}>
                    <label>New Date:</label>
                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />

                    <label>New Time:</label>
                    <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />

                    <div className={styles.buttons}>
                        <button type="submit" className={styles.confirmBtn}>Confirm</button>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RescheduleAppointmentModal;