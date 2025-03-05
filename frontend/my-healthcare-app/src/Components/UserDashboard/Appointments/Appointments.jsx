import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Appointments.module.css";
import { FaCalendarPlus, FaSearch, FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import BookAppointmentModal from "../BookAppointmentModal/BookAppointmentModal";
import CancelConfirmationModal from "../CancelConfirmationModal/CancelConfirmationModal"; // Import the modal
import RescheduleAppointmentModal from "../RescheduleAppointmentModal/RescheduleAppointmentModal";

const Appointments = () => {
    const { token } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);


    useEffect(() => {
        const fetchAppointments = async () => {
            if (!token) return;

            try {
                const response = await axios.get("https://healthcare-backend-a66n.onrender.com/api/getappointments", {
                    headers: { Authorization: `Bearer ${token}` }
                });

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

    const handleCancel = async () => {
        if (!token || !appointmentToCancel) return;

        try {
            await axios.delete(`https://healthcare-backend-a66n.onrender.com/api/appointments/${appointmentToCancel}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAppointments((prevAppointments) =>
                prevAppointments.filter((appointment) => appointment._id !== appointmentToCancel)
            );

            setCancelModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to cancel appointment");
        }
    };

    const openCancelModal = (appointmentId) => {
        setAppointmentToCancel(appointmentId);
        setCancelModalOpen(true);
    };

    const handleAppointmentBooked = (newAppointment) => {
        setAppointments((prev) => [...prev, newAppointment]);
    };

    const filteredAppointments = appointments.filter(
        (appointment) =>
            appointment.doctor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.date?.includes(searchQuery)
    );
    const openRescheduleModal = (appointmentId) => {
        setAppointmentToReschedule(appointmentId);
        setRescheduleModalOpen(true);
    };
    const handleAppointmentRescheduled = (updatedAppointment) => {
        setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
                appointment._id === updatedAppointment._id ? updatedAppointment : appointment
            )
        );
    };


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
                    <button className={styles.bookBtn} onClick={() => setIsModalOpen(true)}>
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
                                    <td>{appointment.doctorName}</td>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.reason}</td>
                                    <td className={styles.actions}>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => openRescheduleModal(appointment._id)}
                                        >
                                            <FaEdit /> Reschedule
                                        </button>

                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => openCancelModal(appointment._id)}
                                        >
                                            <FaTrashAlt /> Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modals */}
            <BookAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                token={token}
                onAppointmentBooked={handleAppointmentBooked}
            />

            <CancelConfirmationModal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                onConfirm={handleCancel}
            />
            <RescheduleAppointmentModal
                isOpen={rescheduleModalOpen}
                onClose={() => setRescheduleModalOpen(false)}
                appointmentId={appointmentToReschedule}
                token={token}
                onReschedule={handleAppointmentRescheduled}
            />

        </div>
    );
};

export default Appointments;
