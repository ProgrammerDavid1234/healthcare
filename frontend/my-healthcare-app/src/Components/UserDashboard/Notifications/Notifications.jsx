import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Notifications.module.css";

const Notifications = () => {
    const { user, token } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user || !user._id) return; // Ensure user is available

            try {
                const response = await axios.get(
                    `https://healthcare-backend-a66n.onrender.com/api/notifications/${user._id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                console.log("API Response:", response.data); // Debugging
                setNotifications(response.data.notifications || []); // Ensure it's an array
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setError("Failed to fetch notifications");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user, token]);

    return (
        <div className={styles.notificationsPage}>
            <Sidebar />
            <div className={styles.content}>
                <h2 className={styles.title}>Notifications</h2>
                {loading ? (
                    <p className={styles.loading}>Loading notifications...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : notifications.length === 0 ? (
                    <p className={styles.empty}>No new notifications.</p>
                ) : (
                    <ul className={styles.notificationList}>
                        {Array.isArray(notifications) && notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <li key={notification.id} className={styles.notificationItem}>
                                    <div className={styles.message}>{notification.message}</div>
                                    <div className={styles.timestamp}>
                                        {new Date(notification.timestamp).toLocaleString()}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No notifications found.</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notifications;