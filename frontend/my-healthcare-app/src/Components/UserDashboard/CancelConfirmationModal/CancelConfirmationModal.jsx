import React from "react";
import styles from "./CancelConfirmationModal.module.css";

const CancelConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Confirm Cancellation</h3>
                <p>Are you sure you want to cancel this appointment?</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.cancelBtn} onClick={onClose}>No</button>
                    <button className={styles.confirmBtn} onClick={onConfirm}>Yes</button>
                </div>
            </div>
        </div>
    );
};

export default CancelConfirmationModal;