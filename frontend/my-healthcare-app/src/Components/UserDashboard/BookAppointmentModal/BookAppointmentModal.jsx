import React, { useState } from "react";
import styles from "./BookAppointmentModal.module.css";
import axios from "axios";

const BookAppointmentModal = ({ isOpen, onClose, token, onAppointmentBooked }) => {
    const [doctorName, setDoctorName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                "https://healthcare-backend-a66n.onrender.com/api/appointments",
                { doctorName, date, time, reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            onAppointmentBooked(response.data);
            onClose();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to book appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Book Appointment</h2>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>Doctor's Name:</label>
                    <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required />

                    <label>Date:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

                    <label>Time:</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />

                    <label>Reason:</label>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />

                    <button type="submit" disabled={loading}>{loading ? "Booking..." : "Confirm Appointment"}</button>
                    <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default BookAppointmentModal;