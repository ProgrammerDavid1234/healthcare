import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Homescreen.module.css";
import { FaUserMd, FaHistory, FaCalendarCheck } from "react-icons/fa";

const Homescreen = () => {
    const { user } = useContext(AuthContext);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );


    // Fetch doctors from API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch("https://healthcare-backend-a66n.onrender.com/api/doctors/available");
                if (!response.ok) {
                    throw new Error("Failed to fetch doctors");
                }

                const data = await response.json();
                console.log("API Response:", data); // Debugging

                if (Array.isArray(data)) {
                    setDoctors(data);
                } else if (Array.isArray(data.doctors)) {
                    setDoctors(data.doctors);
                } else {
                    throw new Error("Invalid data format");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
        const interval = setInterval(fetchDoctors, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);


    return (
        <div className={styles.homepage}>
            <Sidebar />
            <div className={styles.dashboard}>
                <h1>{user ? `Welcome, ${user.name}!` : "Loading your dashboard..."}</h1>
                <p>Manage appointments, medical history, and more.</p>

                {/* Cards Section */}
                <div className={styles.cards}>
                    <div className={styles.card}>
                        <FaCalendarCheck className={styles.icon} />
                        <h3>Appointments</h3>
                        <p>Check upcoming and past appointments.</p>
                    </div>
                    <div className={styles.card}>
                        <FaHistory className={styles.icon} />
                        <h3>Medical History</h3>
                        <p>View and update your medical records.</p>
                    </div>
                    <div className={styles.card}>
                        <FaUserMd className={styles.icon} />
                        <h3>Profile</h3>
                        <p>Update your profile and settings.</p>
                    </div>
                </div>

                {/* Doctors Table */}
                {/* Doctors Table */}
                <div className={styles.tableContainer}>
                    <div className={styles.header}>
                        <h2>Available Doctors</h2>
                        <input
                            type="text"
                            placeholder="Search doctors by name or specialty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    {loading ? (
                        <p>Loading doctors...</p>
                    ) : error ? (
                        <p className={styles.error}>{error}</p>
                    ) : doctors.length === 0 ? (
                        <p>No doctors available</p>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Specialty</th>
                                    <th>Experience</th>
                                    <th>Fee</th>
                                    <th>Rating</th>
                                    <th>Availability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDoctors.map((doctor, index) => (
                                    <tr key={index}>
                                        <td>{doctor.name}</td>
                                        <td>{doctor.specialization}</td>
                                        <td>{doctor.experience} years</td>
                                        <td>${doctor.consultationFee}</td>
                                        <td>{doctor.ratings} ⭐</td>
                                        <td>{doctor.availability}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Homescreen;
