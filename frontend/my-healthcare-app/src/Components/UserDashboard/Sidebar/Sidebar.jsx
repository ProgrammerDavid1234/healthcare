import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import { FaTable, FaUser, FaSignInAlt, FaClipboardList, FaBell, FaFileInvoice } from "react-icons/fa";
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
                <Link to="/userdashboard" onClick={() => handleItemClick("/")}>
                    <li className={activeItem === "/userdashboard" ? styles.active : ""}>
                        <MdDashboard className={styles.icon} /> Dashboard
                    </li>
                </Link>
                <Link to="/availabledoctors" onClick={() => handleItemClick("/availabledoctors")}>
                    <li className={activeItem === "/availabledoctors" ? styles.active : ""}>
                        <FaTable className={styles.icon} /> Available Doctors
                    </li>
                </Link>
                <Link to="/billing" onClick={() => handleItemClick("/billing")}>
                    <li className={activeItem === "/billing" ? styles.active : ""}>
                        <FaFileInvoice className={styles.icon} /> Billing
                    </li>
                </Link>
                <Link to="/rtl" onClick={() => handleItemClick("/rtl")}>
                    <li className={activeItem === "/rtl" ? styles.active : ""}>
                        <FaClipboardList className={styles.icon} /> RTL
                    </li>
                </Link>
                <Link to="/notifications" onClick={() => handleItemClick("/notifications")}>
                    <li className={activeItem === "/notifications" ? styles.active : ""}>
                        <FaBell className={styles.icon} /> Notifications
                    </li>
                </Link>
                <Link to="/profile" onClick={() => handleItemClick("/profile")}>
                    <li className={activeItem === "/profile" ? styles.active : ""}>
                        <FaUser className={styles.icon} /> Profile
                    </li>
                </Link>
                <Link to="/logout" onClick={() => handleItemClick("/logout")}>
                    <li className={activeItem === "/logout" ? styles.active : ""}>
                        <FaSignInAlt className={styles.icon} /> Logout
                    </li>
                </Link>
            </ul>
            <button className={styles.upgradeBtn}>UPGRADE TO PRO</button>
        </div>
    );
};

export default Sidebar;
