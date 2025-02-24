import React from "react";
import styles from "./Sidebar.module.css";
import { FaTable, FaUser, FaSignInAlt, FaClipboardList, FaBell, FaFileInvoice } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { AuthContext } from '../../../context/AuthContext';  // ✅ Import Context


const Sidebar = () => {


  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>MyDoc</h2>
      <ul className={styles.menu}>
        <li className={styles.active}>
          <MdDashboard className={styles.icon} /> Dashboard
        </li>
        <li>
          <FaTable className={styles.icon} /> Tables
        </li>
        <li>
          <FaFileInvoice className={styles.icon} /> Billing
        </li>
        <li>
          <FaClipboardList className={styles.icon} /> RTL
        </li>
        <li>
          <FaBell className={styles.icon} /> Notifications
        </li>
        <li>
          <FaUser className={styles.icon} /> Profile
        </li>
        <li>
          <FaSignInAlt className={styles.icon} /> Sign In
        </li>
        <li>
          <FaClipboardList className={styles.icon} /> Sign Up
        </li>
      </ul>
      <button className={styles.upgradeBtn}>UPGRADE TO PRO</button>
    </div>
  );
};

export default Sidebar;
