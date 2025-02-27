import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import { FaTable, FaUser, FaSignInAlt, FaClipboardList, FaBell, FaFileInvoice, FaComments } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname);

    const handleItemClick = (path) => {
        setActiveItem(path);
    };

    return (
        <div className={styles.sidebar}>
            <h2 className={styles.logo}>MyDoc</h2>
            <ul className={styles.menu}>
                {/* Dashboard */}
                <Link to="/userdashboard" onClick={() => handleItemClick("/userdashboard")}>
                    <li className={activeItem === "/userdashboard" ? styles.active : ""}>
                        <MdDashboard className={styles.icon} /> Dashboard
                    </li>
                </Link>

                {/* Available Doctors */}
                <Link to="/availabledoctors" onClick={() => handleItemClick("/availabledoctors")}>
                    <li className={activeItem === "/availabledoctors" ? styles.active : ""}>
                        <FaTable className={styles.icon} /> Available Doctors
                    </li>
                </Link>

                {/* Appointments */}
                <Link to="/appointment" onClick={() => handleItemClick("/appointment")}>
                    <li className={activeItem === "/appointment" ? styles.active : ""}>
                        <FaClipboardList className={styles.icon} /> Appointments
                    </li>
                </Link>

                {/* Medical Records */}
                <Link to="/medicalRecords" onClick={() => handleItemClick("/medicalRecords")}>
                    <li className={activeItem === "/medicalRecords" ? styles.active : ""}>
                        <FaFileInvoice className={styles.icon} /> Medical Records
                    </li>
                </Link>

                {/* Messages */}
                <Link to="/messages" onClick={() => handleItemClick("/messages")}>
                    <li className={activeItem === "/messages" ? styles.active : ""}>
                        <FaComments className={styles.icon} /> Messages
                    </li>
                </Link>

                {/* Notifications */}
                <Link to="/notifications" onClick={() => handleItemClick("/notifications")}>
                    <li className={activeItem === "/notifications" ? styles.active : ""}>
                        <FaBell className={styles.icon} /> Notifications
                    </li>
                </Link>

                {/* Profile */}
                <Link to="/profile" onClick={() => handleItemClick("/profile")}>
                    <li className={activeItem === "/profile" ? styles.active : ""}>
                        <FaUser className={styles.icon} /> Profile
                    </li>
                </Link>

                {/* Logout */}
                <Link to="/login" onClick={() => handleItemClick("/login")}>
                    <li className={activeItem === "/login" ? styles.active : ""}>
                        <FaSignInAlt className={styles.icon} /> Logout
                    </li>
                </Link>
            </ul>
            <button className={styles.upgradeBtn}>UPGRADE TO PRO</button>
        </div>
    );
};

export default Sidebar;