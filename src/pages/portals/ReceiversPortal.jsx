import Sidebar from "../../components/mainComponents/Sidebar";
import styles from "../../styles/Receivers.module.css";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import RecipientModal from "../../components/common/RecipientModal";
import {
    createRecipient, createRecipientt,
    deleteRecipient,
    fetchAccountsForUser,
    fetchRecipients, fetchUserLoans,
    updateRecipient, updateRecipientt
} from "../../services/AxiosBanking";
import Button from "@mui/material/Button";
import DataTable from "../../components/tables/DataTable";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {toast} from "react-toastify";

function ReceiversPortal() {
    const token = localStorage.getItem("token");
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

    const [rows, setRows] = useState([]);
    const columns = [
        { field: "id", headerName: "ID", width: 200 },
        { field: "recipient", headerName: "Recipient", width: 150 },
        { field: "accountNumber", headerName: "Account Number", width: 150 },
        {
            field: "Edit",
            headerName: "",
            width: 120,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => openEditModal(params.row)}
                >
                    Edit
                </Button>
            ),
        },{
            field: "Delete",
            headerName: "",
            width: 120,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleDeleteRecipient(params.row.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    useEffect(() => {
        loadAccounts();
    }, []);

    const openEditModal = (recipient) => {
        const newRecipient = {
            id: recipient.id,
            fullName: recipient.recipient,
            accountNumber: recipient.accountNumber,
            address: recipient.address || "",
        };
        console.log("Recipient data for edit modal1:", recipient);
        console.log("Recipient data for edit modal:", newRecipient);

        setEditRecipient(newRecipient);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const openAddModal = () => {
        if (selectedAccount) {
            setNewRecipient({ fullName: "", accountNumber: "", address: "" });
            setIsAddModalOpen(true);
        }
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const loadAccounts = async () => {
        try {
            console.log("Fetching accounts for user...");
            const fetchedAccounts = await fetchAccountsForUser(userId);
            console.log("Fetched accounts:", fetchedAccounts);
            if (fetchedAccounts && Array.isArray(fetchedAccounts)) {



                setAccounts(fetchedAccounts);
                console.log("Accounts set:", fetchedAccounts);
            } else {
                console.error("API response does not contain accounts array:", fetchedAccounts);
                setAccounts([]);
            }
        } catch (err) {
            console.error("Failed to fetch accounts:", err);
        }
    };

    const loadRecipients = async (accountId) => {
        try {
            const data = await fetchRecipients(accountId);
            const formattedRecievers = data.data.receivers.map((receiver) => ({
                id: receiver.id,
                recipient: receiver.firstName + " " + receiver.lastName,
                accountNumber: receiver.accountNumber,
            }));
            setRows(formattedRecievers);
            console.log(formattedRecievers)

        } catch (err) {
            console.error("Failed to fetch recipients:", err);
        }
    };

    const handleCreateRecipient = async (recipient) => {
        try {
            const selectedAcc = accounts.find(acc => acc.id === selectedAccount);
            if (!selectedAcc) {
                console.error("No selected account.");
                return;
            }

            if (!/^\d{16,}$/.test(recipient.accountNumber)) {
                toast.error("Account number must be at least 16 digits.");
                return;
            }

            const recipientData = {
                ownerAccountId: selectedAcc.id,
                accountNumber: recipient.accountNumber,
                fullName: recipient.fullName,
                address: recipient.address || "",
            };

            await createRecipientt(recipientData);
            await loadRecipients(selectedAcc.id);
            closeAddModal();
        } catch (error) {
            console.error("Error adding recipient:", error);
        }
    };

    const handleEditRecipient = async (recipient) => {
        try {
            console.log("🔹 Raw recipient data received:", recipient);

            if (!recipient || !recipient.id || !recipient.accountNumber || !recipient.fullName) {
                console.error("Invalid recipient data:", recipient);
                return;
            }

            const selectedAcc = accounts.find(acc => acc.id === selectedAccount);
            if (!selectedAcc) {
                console.error("No account selected.");
                return;
            }

            const updatedRecipientData = {
                id: recipient.id,
                ownerAccountId: selectedAcc.id,
                accountNumber: recipient.accountNumber,
                fullName: recipient.fullName,
                address: recipient.address || "",
            };


            await updateRecipientt(recipient.id, updatedRecipientData);

            console.log("Recipient successfully updated!");

            await loadRecipients(selectedAcc.id);
            closeEditModal();
        } catch (error) {
            console.error("Error updating recipient:", error.response?.data || error.message);
        }
    };

    const handleDeleteRecipient = async (recipientId) => {
        try {
            await deleteRecipient(recipientId);
            const selectedAcc = accounts.find(acc => acc.id === selectedAccount);
            await loadRecipients(selectedAcc.id);
        } catch (error) {
            console.error("Error deleting recipient:", error);
        }
    };

    const handleAccountSelection = (accountId) => {

        if (!accountId) return;
        setSelectedAccount(accountId);
        const selectedAcc = accounts.find(acc => acc.id === accountId);

        if (selectedAcc) {
            loadRecipients(selectedAcc.id);
        }
    };

    return (
        <div className={styles.page}>
            <Sidebar/>
            {/*<div className={styles.container}>*/}
            <h1 className={styles.title}>Recipients</h1>


            <div style={{padding: "20px", marginTop: "64px", width: "100%", textAlign: "left", fontSize: 20}}>
                <h2>Recepients Overview</h2>


                    <div className={styles.dropdown}>
                        <TextField
                            id="accounts"
                            select
                            label="Select an account"
                            value={selectedAccount || ""}
                            onChange={(e) => handleAccountSelection(e.target.value)}
                            helperText="Please select your account"
                            variant="standard"

                        >
                            {accounts.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.accountNumber}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className={styles.addButton}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={openAddModal}
                            className={styles.addButton}

                            >
                            Add Recipient
                        </Button>
                    </div>

                <div style={{ maxWidth: "99%" }}>
                    <DataTable rows={rows} columns={columns} checkboxSelection={false}/>
                </div>
            </div>


            {/*<table className={styles.table}>*/}
            {/*    <thead>*/}
            {/*    <tr>*/}
            {/*        <th>ID</th>*/}
            {/*        <th>Recipient</th>*/}
            {/*        <th>Account Number</th>*/}
            {/*        <th></th>*/}
            {/*        <th className={styles.addButtonWrapper}>*/}
            {/*            <button*/}
            {/*                onClick={openAddModal}*/}
            {/*                className={styles.addButton}>*/}
            {/*                Add Recipient*/}
            {/*            </button>*/}
            {/*        </th>*/}
            {/*    </tr>*/}
            {/*    </thead>*/}
            {/*    <tbody>*/}
            {/*    {recipients.map((recipient) => (*/}
            {/*        <tr key={recipient.id}>*/}
            {/*            <td>{recipient.id}</td>*/}
            {/*            <td>{recipient.firstName + " " + recipient.lastName}</td>*/}
            {/*            <td>{recipient.accountNumber}</td>*/}
            {/*            <td>*/}
            {/*                <button*/}
            {/*                    onClick={() => openEditModal(recipient)}*/}
            {/*                    className={styles.editButton}>*/}
            {/*                    Edit*/}
            {/*                </button>*/}
            {/*            </td>*/}
            {/*            <td>*/}
            {/*                <button*/}
            {/*                    onClick={() => handleDeleteRecipient(recipient.id)}*/}
            {/*                    className={styles.deleteButton}>*/}
            {/*                    Delete*/}
            {/*                </button>*/}
            {/*            </td>*/}
            {/*        </tr>*/}
            {/*    ))}*/}
            {/*    </tbody>*/}
            {/*</table>*/}
            {/*<DataTable rows={rows} columns={columns} checkboxSelection={false}/>*/}

            <RecipientModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                data={editRecipient}
                onSave={handleEditRecipient}
                title={"Edit Recipient"}
            />

            <RecipientModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                data={newRecipient}
                onSave={handleCreateRecipient}
                title={"Add New Recipient"}
            />
            {/*</div>*/}
        </div>
    );
}

export default ReceiversPortal;