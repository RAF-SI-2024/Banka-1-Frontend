import React, { useEffect, useState } from 'react';
import styles from '../../styles/ReceiversModal.module.css';

function RecipientModal({ isOpen, onClose, data, onSave, title }) {
    const [formData, setFormData] = useState({
        id: null,
        fullName: "",
        accountNumber: "",
        address: ""
    });

    const [errors, setErrors] = useState({
        fullName: "",
        accountNumber: "",
    });

    useEffect(() => {
        if (isOpen) {
            console.log("Modal received recipient data:", data);

            setFormData({
                id: data?.id || null,
                fullName: data?.fullName || "",
                accountNumber: data?.accountNumber || "",
                address: ""
            });
            setErrors({});
        }
    }, [isOpen, data]);

    if (!isOpen) return null;

    const handleBackgroundClick = (e) => {
        if (e.target.classList.contains(styles.modal)) {
            setErrors({});
            onClose();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Sending recipient data from modal:", formData);

        let validationErrors = {};
        if (!formData.fullName.trim()) {
            validationErrors.fullName = "Recipient name is required.";
        }
        if (!formData.accountNumber.trim()) {
            validationErrors.accountNumber = "Account number is required.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        onSave(formData);
        onClose();
    };

    return (
        <div className={styles.modal} onClick={handleBackgroundClick}>
            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={onClose}>&times;</span>
                <h2>{title}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label className={styles.textboxLabel}>Recipient Name:</label>
                        <input
                            className={styles.textbox}
                            type="text"
                            value={formData.fullName}
                            placeholder="Enter recipient name"
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                        {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
                    </div>

                    <div className={styles.inputContainer}>
                        <label className={styles.textboxLabel}>Account Number:</label>
                        <input
                            className={styles.textbox}
                            type="text"
                            value={formData.accountNumber}
                            placeholder="Enter account number"
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        />
                        {errors.accountNumber && <p className={styles.error}>{errors.accountNumber}</p>}
                    </div>

                    <div className={styles.buttonContainer}>
                        <button onClick={onClose} className={styles.cancelButton} type="button">Cancel</button>
                        <button className={styles.saveButton} type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RecipientModal;