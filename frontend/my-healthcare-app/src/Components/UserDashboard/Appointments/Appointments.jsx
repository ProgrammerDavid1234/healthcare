import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Appointments.module.css";
import { FaCalendarPlus, FaSearch, FaEdit, FaTrashAlt } from "react-icons/fa";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]); // Default to an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch("https://healthcare-backend-a66n.onrender.com/api/appointments");
                if (!response.ok) {
                    throw new Error("Failed to fetch appointments");
                }
                const data = await response.json();
                console.log("API Response:", data); // Debugging

                if (Array.isArray(data)) {
                    setAppointments(data);  // Direct array response
                } else if (Array.isArray(data.appointments)) {
                    setAppointments(data.appointments); // If appointments are inside an object
                } else {
                    throw new Error("Invalid API response format");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    // Ensure `appointments` is an array before filtering
    const filteredAppointments = Array.isArray(appointments)
        ? appointments.filter(appointment =>
            appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.date.includes(searchQuery)
        )
        : [];

    return (
        <div className={styles.appointmentsPage}>
            <Sidebar />
            <div className={styles.content}>
                <div className={styles.header}>
                    <h2>Appointments</h2>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search by doctor or date..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className={styles.searchIcon} />
                    </div>
                    <button className={styles.bookBtn}>
                        <FaCalendarPlus /> Book New Appointment
                    </button>
                </div>

                {loading ? (
                    <p>Loading appointments...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : filteredAppointments.length === 0 ? (
                    <p>No appointments found.</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{appointment.doctor}</td>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.reason}</td>
                                    <td className={styles.actions}>
                                        <button className={styles.editBtn}>
                                            <FaEdit /> Reschedule
                                        </button>
                                        <button className={styles.deleteBtn}>
                                            <FaTrashAlt /> Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Appointments;
