import Sidebar from "../../components/mainComponents/Sidebar";
import styles from "../../styles/Receivers.module.css";
import React, {useEffect, useState} from "react";
import { jwtDecode } from "jwt-decode";

import RecipientModal from "../../components/common/RecipientModal";
import {
    createRecipient,
    deleteRecipient,
    fetchAccountsForUser,
    fetchRecipients,
    updateRecipient
} from "../../services/AxiosBanking";



function ReceiversPortal() {

    const token =  localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editRecipient, setEditRecipient] = useState(null);
    const [newRecipient, setNewRecipient] = useState({
        fullName: "",
        accountNumber: "",

    });
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [recipients, setRecipients] = useState([]);
    useEffect(() => {
        loadAccounts();
    }, []);



    const openEditModal =  (recipient) => {
        setEditRecipient(recipient);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const openAddModal = () => {
        if(selectedAccount) { //ako nema izabranog naloga ne moze da se otvori dugme
            setNewRecipient({fullName: "", accountNumber: ""});
            setIsAddModalOpen(true);
        }
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const loadAccounts = async () => {  //ucitavanje racuna
        try {
            const data = await fetchAccountsForUser(userId);
            setAccounts(data);
        } catch (err) {
            console.error("Failed to fetch accounts:", err);
        }

    };

    const loadRecipients = async (accountId) => {
        try {
            const data = await fetchRecipients(accountId);
            setRecipients(data);
        } catch (err) {
            console.error("Failed to fetch recipients:", err);
        }
    };


    const handleCreateRecipient = async (recipient) => {

        try {
            const createdRecipient = await createRecipient(selectedAccount, recipient);

            const selectedAcc = accounts.find(acc => acc.ownerID.toString() === selectedAccount);
            await loadRecipients(selectedAcc.id);
            closeAddModal();
        } catch (error) {
            console.error("Error adding recipient:", error);
        }
    };


    const handleEditRecipient = async (recipient) => {
        console.log(recipient)

        try {
            await updateRecipient(selectedAccount ,recipient.id, recipient);

            const selectedAcc = accounts.find(acc => acc.ownerID.toString() === selectedAccount);
            await loadRecipients(selectedAcc.id);
            closeEditModal();
        } catch (error) {
            console.error("Error updating recipient:", error);
        }
    };





    const handleDeleteRecipient = async (recipientId) => {

        try {
            await deleteRecipient(recipientId);
            const selectedAcc = accounts.find(acc => acc.ownerID.toString() === selectedAccount);
            await loadRecipients(selectedAcc.id);
        } catch (error) {
            console.error("Error deleting recipient:", error);
        }

    };
    const handleAccountSelection = (accountId) => {
        if (!accountId) return;

        setSelectedAccount(accountId);

        const selectedAcc = accounts.find(acc => acc.ownerID.toString() === accountId);

        if (selectedAcc) {
            console.log("Selected Account:", selectedAcc);
            console.log("Account Number:", selectedAcc.accountNumber);

            loadRecipients(selectedAcc.id);
        }
    };


    return (
        <div className={styles.page}>
            <Sidebar/>
            <div className={styles.container}>
                <h1 className={styles.title}>Recipients</h1>
                <select
                    id="accountSelect"
                    value={selectedAccount || ""}
                    onChange={(e) => handleAccountSelection(e.target.value)}
                    className={styles.dropdown}
                >
                    <option value="" disabled>
                        Select an account
                    </option>

                    {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.accountNumber} {/* Display account number */}
                        </option>
                    ))}
                </select>
                <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Recipient</th>
                        <th>Account Number</th>
                        <th></th>
                        <th className={styles.addButtonWrapper}>
                            <button
                                onClick={openAddModal}
                                className={styles.addButton}>
                                Add Recipient
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {recipients.map((recipient) => (
                        <tr key={recipient.id}>
                            <td>{recipient.fullName}</td>
                            <td>{recipient.accountNumber}</td>
                            <td>
                                <button
                                    onClick={() => openEditModal(recipient)}
                                    className={styles.editButton}>
                                    Edit
                                </button>
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDeleteRecipient(recipient.id)}
                                    className={styles.deleteButton}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <RecipientModal isOpen={isEditModalOpen}
                                onClose={closeEditModal}
                                data={editRecipient}
                                onSave={handleEditRecipient}
                                tittle={"Edit Recipient"}
                />

                <RecipientModal isOpen={isAddModalOpen}
                                onClose={closeAddModal}
                                data={newRecipient}
                                onSave={handleCreateRecipient}
                                tittle={"Add New Recipient"}
                />

            </div>
        </div>
    );
}

export default ReceiversPortal;