import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Appointments.module.css";
import { FaCalendarPlus, FaSearch, FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";

const Appointments = () => {
    const { token } = useContext(AuthContext); // Get token from context
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!token) return; // Don't fetch if token is missing

            try {
                const response = await axios.get("https://healthcare-backend-a66n.onrender.com/api/getappointments", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("API Response:", response.data);

                if (Array.isArray(response.data)) {
                    setAppointments(response.data);
                } else if (Array.isArray(response.data.appointments)) {
                    setAppointments(response.data.appointments);
                } else {
                    throw new Error("Invalid API response format");
                }
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch appointments");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [token]);

    const filteredAppointments = appointments.filter(
        (appointment) =>
            appointment.doctor?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            appointment.date?.includes(searchQuery)
    );
    
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
                                    <td>{appointment.doctorId}</td>
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
