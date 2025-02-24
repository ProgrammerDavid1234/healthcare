import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import styles from './AvailableDoctors.module.css';

const AvailableDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://healthcare-backend-a66n.onrender.com/api/doctors/available');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging

        if (Array.isArray(data)) {
          setDoctors(data);
        } else if (Array.isArray(data.doctors)) {
          setDoctors(data.doctors); // If the response is an object with a `doctors` array
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2>Available Doctors</h2>

        {/* Loading and Error Handling */}
        {loading ? <p>Loading doctors...</p> : error ? <p className={styles.error}>{error}</p> : (
          <div className={styles.doctorList}>
            {doctors.length === 0 ? <p>No doctors available</p> : doctors.map((doctor) => (
              <div key={doctor._id} className={`${styles.card} ${doctor.availability ? styles.available : styles.unavailable}`}>
                <h3>{doctor.name}</h3>
                <p><strong>Specialty:</strong> {doctor.specialization}</p>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p><strong>Fee:</strong> ${doctor.consultationFee}</p>
                <p><strong>Rating:</strong> {doctor.ratings} ⭐</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableDoctors;
