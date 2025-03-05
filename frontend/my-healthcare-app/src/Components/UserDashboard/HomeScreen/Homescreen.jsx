import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Homescreen.module.css";
import { FaUserMd, FaHistory, FaCalendarCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

const Homescreen = () => {
    const { user } = useContext(AuthContext);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const doctorsPerPage = 5;

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

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
                    <Link to='/appointment'>
                        <div className={styles.card}>
                            <FaCalendarCheck className={styles.icon} />
                            <h3>Appointments</h3>
                            <p>Check upcoming and past appointments.</p>
                        </div>
                    </Link>
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
                    ) : filteredDoctors.length === 0 ? (
                        <p>No doctors available</p>
                    ) : (
                        <>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Specialty</th>
                                        <th>Experience</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentDoctors.map((doctor, index) => (
                                        <tr key={index}>
                                            <td>{doctor.name}</td>
                                            <td>{doctor.specialization}</td>
                                            <td>{doctor.experience} years</td>
                                            <td>{doctor.ratings} ⭐</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className={styles.pagination}>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Homescreen;
