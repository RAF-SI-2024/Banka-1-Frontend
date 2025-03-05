import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/mainComponents/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "../../styles/NewPaymentPortal.css";
import PaymentResultModal from "../../components/common/PaymentResultModal";
import {fetchCustomers} from "../../services/AxiosUser";
import {fetchAccountsForUser, fetchRecipients} from "../../services/AxiosBanking";

import { Autocomplete, TextField } from "@mui/material";
import {jwtDecode} from "jwt-decode";

const NewPaymentPortal =  () => {
    const location = useLocation();
    const recipient = location.state?.recipient || {};
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        loadAccounts();
    }, []);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [recipients, setRecipients] = useState([]);
    useEffect(() => {
        loadAccounts();
    }, []);


    const loadAccounts = async () => {
        try {
            const data = await fetchAccountsForUser(userId);
            setAccounts(data);
        } catch (err) {
            console.error("Failed to fetch accounts:", err);
        }
        setAccounts([
            {
                id: 1,
                ownerID: 1,
                accountNumber: 123456788,
                currency: "RSD",
                type: "CURRENT",
                subtype: "PERSONAL",
                dailyLimit: 0,
                monthlyLimit: 0,
                status: "ACTIVE"

            },
            {
                id: 2,
                ownerID: 2,
                accountNumber: 123456789,
                currency: "RSD",
                type: "CURRENT",
                subtype: "PERSONAL",
                dailyLimit: 100000,
                monthlyLimit: 1000000,
                status: "ACTIVE"

            }
        ])

    };

    const loadRecipients = async (accountId) => {
        try {
            const data = await fetchRecipients(accountId);
            setRecipients(data);
        } catch (err) {
            console.error("Failed to fetch recipients:", err);
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

            setRecipients([
                { fullName: "John Doe", accountNumber: "123456789" },
                { fullName: "Jane Smith", accountNumber: "987654321" },
                { fullName: "Michael Johnson", accountNumber: "567890123" },
            ]);
        }

        const handleConfirm = () => {
            if (newPayment.recipientName && newPayment.recipientAccount) {
                setRecipients((prevRecipients) => [
                    ...prevRecipients,
                    { fullName: newPayment.recipientName, accountNumber: newPayment.recipientAccount }
                ]);
            }
            setOpenModal(false); // ne radi tj ne dodaje recipiante
        };

        return (
            <PaymentResultModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                success={isSuccess}
                onConfirm={handleConfirm}
            />
        );
    };


    const [newPayment, setNewPayment] = useState({
        payerAccount: "",
        recipientName: recipient.name || "",
        recipientAccount: recipient.accountNumber || "",
        paymentCode: "2xx",
        paymentPurpose: "",
        amount: "",
        referenceNumber: "",
    });

    const [openModal, setOpenModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [toggleSuccess, setToggleSuccess] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchCustomers()
            .then((data) => {
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    setUsers([]);
                }
            })
            .catch(() => setUsers([]));
    }, []);

    const handleCreatePayment = (e) => {
        e.preventDefault();
        setIsSuccess(toggleSuccess);
        setToggleSuccess(!toggleSuccess);
        setOpenModal(true);
    };

    return (
        <div>
            <Sidebar/>
            <div className="payment-container">
                <h2>New Payment</h2>

                <form onSubmit={handleCreatePayment} className="payment-form">
                    <div className="payer-account">
                        <label>Payer Account</label>
                        <select
                            id="accountSelect"
                            value={selectedAccount || ""}
                            onChange={(e) => handleAccountSelection(e.target.value)}
                        >
                            <option value="" disabled>
                                Select an account
                            </option>

                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.accountNumber} {}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="recipient-name">
                            <label>Recipient Name</label>
                            <Autocomplete
                                options={recipients}
                                getOptionLabel={(option) => option?.fullName ?? ""}
                                isOptionEqualToValue={(option, value) => option.accountNumber === value.accountNumber}
                                value={recipients.find(rec => rec.accountNumber === newPayment.recipientAccount) || null}
                                onChange={(event, value) => {
                                    setNewPayment({
                                        ...newPayment,
                                        recipientName: value?.fullName || "",
                                        recipientAccount: value?.accountNumber || "",
                                    });
                                    // blurOnSelect={false} // Sprečava brisanje teksta nakon klika van
                                    // onBlur={(event) => {
                                    //     // Ova funkcija osigurava da unesena vrednost ne nestane
                                    //     if (!newPayment.recipientName) {
                                    //         setNewPayment({...newPayment, recipientName: event.target.value});
                                    //     }
                                }}
                                renderInput={(params) => <TextField {...params} label=""/>}
                            />
                        </div>


                        <div className="payment-code">
                            <label>Payment Code</label>
                            <select
                                value={newPayment.paymentCode}
                                onChange={(e) => setNewPayment({...newPayment, paymentCode: e.target.value})}
                            >
                                <option value="2xx">2xx</option>
                                <option value="3xx">3xx</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="recipient-account">
                            <label>Recipient Account</label>
                            <input
                                type="text"
                                value={newPayment.recipientAccount}
                                onChange={(e) => setNewPayment({...newPayment, recipientAccount: e.target.value})}
                                required
                            />
                        </div>

                        <div className="payment-purpose">
                            <label>Payment Purpose</label>
                            <input
                                type="text"
                                value={newPayment.paymentPurpose}
                                onChange={(e) => setNewPayment({...newPayment, paymentPurpose: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="amount-row">
                        <div className="amount">
                            <label>Amount</label>
                            <div className="amount-wrapper">
                                <input
                                    type="number"
                                    value={newPayment.amount}
                                    onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                                    required
                                />
                                <span className="info-icon">ℹ️</span>
                            </div>
                        </div>
                    </div>

                    <div className="reference-row">
                        <div className="reference-number">
                            <label>Reference Number</label>
                            <input
                                type="text"
                                value={newPayment.referenceNumber}
                                onChange={(e) => setNewPayment({...newPayment, referenceNumber: e.target.value})}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Continue</button>
                    </div>
                </form>

                <ToastContainer position="bottom-right"/>

                <PaymentResultModal open={openModal} onClose={() => setOpenModal(false)} success={isSuccess}/>
            </div>
        </div>
    );
};

export default NewPaymentPortal;
