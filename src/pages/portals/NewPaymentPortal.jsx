import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/mainComponents/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "../../styles/NewPaymentPortal.css";
import PaymentResultModal from "../../components/common/PaymentResultModal";
import {fetchAccountsForUser, fetchRecipients} from "../../services/AxiosBanking";
import {createNewMoneyTransfer} from "../../services/AxiosBanking";
import {createRecipient} from "../../services/AxiosBanking"

import { Autocomplete, TextField } from "@mui/material";
import {jwtDecode} from "jwt-decode";

const NewPaymentPortal =  () => {
    const location = useLocation();
    const recipient = location.state?.recipient || {};
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [recipients, setRecipients] = useState([]);
    useEffect(() => {
        loadAccounts();
    }, []);
    const [dailyLimit, setDailyLimit] = useState(null);
    const [paymentMessage, setPaymentMessage] = useState("");



    const loadAccounts = async () => {
        try {
            const data = await fetchAccountsForUser(userId);
            setAccounts(data.data.accounts);
            // console.log(data);
        } catch (err) {
            console.error("Failed to fetch accounts:", err);
        }
        // setAccounts([
        //     {
        //         id: 1,
        //         ownerID: 1,
        //         accountNumber: 123456788,
        //         currency: "RSD",
        //         type: "CURRENT",
        //         subtype: "PERSONAL",
        //         dailyLimit: 0,
        //         monthlyLimit: 0,
        //         status: "ACTIVE"
        //
        //     },
        //     {
        //         id: 2,
        //         ownerID: 2,
        //         accountNumber: 123456789,
        //         currency: "RSD",
        //         type: "CURRENT",
        //         subtype: "PERSONAL",
        //         dailyLimit: 100000,
        //         monthlyLimit: 1000000,
        //         status: "ACTIVE"
        //
        //     }
        // ])

    };
    useEffect(() => {
        console.log("Accounts Loaded:", accounts);
    }, [accounts]);


    const loadRecipients = async (accountId) => {
        try {
            const data = await fetchRecipients(accountId);
            setRecipients(data.data.receivers);
            console.log(data);
        } catch (err) {
            console.error("Failed to fetch recipients:", err);
        }
    };

    const handleAccountSelection = (accountId) => {
        if (!accountId) return;

        setSelectedAccount(accountId);

        const selectedAcc = accounts.find(acc => acc.id.toString() === accountId);

        if (selectedAcc) {
            setDailyLimit(selectedAcc.dailyLimit);
            console.log("Selected Account:", selectedAcc);
            console.log("Account Number:", selectedAcc.accountNumber);

            loadRecipients(selectedAcc.id);

            // setRecipients([
            //     { fullName: "John Doe", accountNumber: "123456789" },
            //     { fullName: "Jane Smith", accountNumber: "987654321" },
            //     { fullName: "Michael Johnson", accountNumber: "567890123" },
            // ]);
        }



        const handleConfirm = async () => {
            if (isSuccess) {
                const nameParts = newPayment.recipientName.trim().split(" ");
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(" ") || "N/A";

                const newRecipient = {
                    firstName,
                    lastName,
                    accountNumber: newPayment.recipientAccount,
                };

                try {
                    await handleCreateRecipient(newRecipient);
                } catch (error) {
                    console.error("Error confirming recipient addition:", error);
                }
            }

            setOpenModal(false);
        };
        return (
            <PaymentResultModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                success={isSuccess}
                onConfirm={handleConfirm}
            />
        );


        const handleCreateRecipient = async (recipient) => {
            try {
                const selectedAcc = accounts.find(acc => acc.id.toString() === selectedAccount);
                const createdRecipient = await createRecipient(selectedAcc.accountNumber, recipient);

                await loadRecipients(selectedAcc.id);
            } catch (error) {
                console.error("Error adding recipient:", error);
            }
        };


    };


    const [newPayment, setNewPayment] = useState({
        payerAccount: "",
        recipientName: recipient.name || "",
        recipientAccount: recipient.accountNumber || "",
        paymentCode: "289",
        paymentPurpose: "",
        amount: "",
        adsress: "",
        referenceNumber: "",
    });

    const [openModal, setOpenModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [toggleSuccess, setToggleSuccess] = useState(true);
    const [users, setUsers] = useState([]);



    const handleCreatePayment = async (e) => {
        e.preventDefault();

        if (!selectedAccount || !newPayment.recipientAccount || !newPayment.amount) {
            toast.error("Molimo popunite sva obavezna polja.");
            return;
        }

        const transferData = {
            fromAccountId: selectedAccount,
            recipientAccount: newPayment.recipientAccount,
            amount: parseFloat(newPayment.amount),
            receiver: newPayment.recipientName,
            adress: newPayment.adress,
            payementCode: newPayment.paymentCode,
            paymentReference: newPayment.referenceNumber,
            paymentDescription: newPayment.paymentPurpose
        };
        console.log("Trans id " + transferData.fromAccountId);
        console.log("Trans recipientAccount " + transferData.recipientAccount);
        console.log("Trans amount " + transferData.amount);
        console.log("Trans receiver " + transferData.receiver);
        console.log("Trans adress " + transferData.adress);
        console.log("Trans payementCode " + transferData.payementCode);
        console.log("Trans payementReference " + transferData.paymentReference);
        console.log("Trans payementDescription " + transferData.paymentDescription);


        try {
            const result = await createNewMoneyTransfer(transferData);
            console.log(transferData);

            if (result.success) {
                toast.success(result.data.message || "Uspešno ste izvršili uplatu!");
                setIsSuccess(true);
                setPaymentMessage(result.data.reason || "Payment completed successfully."); // Preuzmi `reason`
            } else {
                toast.error(result.error || "Greška prilikom uplate.");
                setIsSuccess(false);
                setPaymentMessage(result.data.reason || "Payment failed. Please try again."); // Preuzmi `reason`
            }
        } catch (error) {
            toast.error("Došlo je do greške. Pokušajte ponovo.");
            setIsSuccess(false);
            setPaymentMessage(error.response?.data?.reason || "Unexpected error occurred. Please try again later."); // Preuzmi `reason` ako postoji
        }

        setOpenModal(true); // Otvaramo modal da prikažemo rezultat
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
                                freeSolo
                                options={recipients}
                                getOptionLabel={(option) => (typeof option === "string" ? option : option?.firstName + " " + option?.lastName ?? "")}
                                isOptionEqualToValue={(option, value) => option?.accountNumber === value?.accountNumber}
                                value={recipients.find(rec => rec.accountNumber === newPayment.recipientAccount) || newPayment.recipientName || ""} // Održava unos
                                onChange={(event, value) => {
                                    if (typeof value === "string") {
                                        setNewPayment({
                                            ...newPayment,
                                            recipientName: value,
                                            recipientAccount: "",
                                        });
                                    } else if (value) {
                                        setNewPayment({
                                            ...newPayment,
                                            recipientName: value.firstName + " " + value.lastName,
                                            recipientAccount: value.accountNumber,
                                        });
                                    }
                                }}
                                onBlur={(event) => {
                                    if (!newPayment.recipientName) {
                                        setNewPayment({
                                            ...newPayment,
                                            recipientName: event.target.value,
                                        });
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="" />}
                                openOnFocus
                                clearOnBlur={false}
                            />
                        </div>


                        <div className="payment-code">
                            <label>Payment Code</label>
                            <select
                                value={newPayment.paymentCode}
                                onChange={(e) => setNewPayment({...newPayment, paymentCode: e.target.value})}
                            >
                                <option value="289">289</option>
                                <option value="199">199</option>
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
                                // required
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
                                <span title={`Daily Limit: ${dailyLimit ?? "N/A"}`} style={{ cursor: "pointer" }}>ℹ️</span>
                            </div>
                        </div>
                        <div className="adress">
                            <label>Address</label>
                            <input
                                type="text"
                                value={newPayment.adress}
                                onChange={(e) => setNewPayment({...newPayment, adress: e.target.value})}

                            />
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
