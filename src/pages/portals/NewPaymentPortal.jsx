import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/mainComponents/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "../../styles/NewPaymentPortal.css";
import PaymentResultModal from "../../components/common/PaymentResultModal";
import {fetchAccountsForUser, fetchRecipients} from "../../services/AxiosBanking";
import {createNewMoneyTransfer} from "../../services/AxiosBanking";
import {createRecipient} from "../../services/AxiosBanking"
import {getPaymentCodes} from "../../services/AxiosBanking"
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
    const [dailyLimit, setDailyLimit] = useState(null);
    const [paymentMessage, setPaymentMessage] = useState("");
    const [paymentCodes, setPaymentCodes] = useState([]);

    const handleCreateRecipient = async (recipient) => {
        try {
            const selectedAcc = accounts.find(acc => acc.id.toString() === selectedAccount.id.toString());
            const createdRecipient = await createRecipient(selectedAcc.accountNumber, recipient);

            setRecipients(prevRecipients => [...prevRecipients, createdRecipient.data]);

        } catch (error) {
            console.error("Error adding recipient:", error);
        }
    };

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

    };

    useEffect(() => {
        if (selectedAccount) {
            loadRecipients();
        }
    }, [selectedAccount]);

    const loadRecipients = async () => {
        try {
            const data = await fetchRecipients(selectedAccount.id);

            setRecipients(data.data.receivers);
        } catch (err) {
            console.error("Failed to fetch recipients:", err);
        }
    };

    const handleAccountSelection = (accountId) => {
        if (!accountId) return;

        const selectedAcc = accounts.find(acc => acc.id.toString() === accountId);

        if (selectedAcc) {
            setSelectedAccount(selectedAcc);
            setDailyLimit(selectedAcc.dailyLimit);
            loadRecipients();
        }



        // const handleConfirm = async () => {
        //     if (isSuccess) {
        //         const nameParts = newPayment.recipientName.trim().split(" ");
        //         const firstName = nameParts[0];
        //         const lastName = nameParts.slice(1).join(" ") || "N/A";
        //
        //         const newRecipient = {
        //             firstName,
        //             lastName,
        //             accountNumber: newPayment.recipientAccount,
        //         };
        //
        //         try {
        //             await handleCreateRecipient(newRecipient);
        //
        //             setRecipients(prevRecipients => [...prevRecipients, newRecipient]);
        //
        //             // await loadRecipients(selectedAccount.id);
        //         } catch (error) {
        //             console.error("Error confirming recipient addition:", error);
        //         }
        //     }
        //
        //     setOpenModal(false);
        // };

        return (
            <PaymentResultModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                success={isSuccess}
                paymentMessage={paymentMessage}
                onConfirm={handleConfirm}
            />


        );


        // const handleCreateRecipient = async (recipient) => {
        //     try {
        //         const selectedAcc = accounts.find(acc => acc.id.toString() === selectedAccount.id.toString());
        //         const createdRecipient = await createRecipient(selectedAcc.accountNumber, recipient);
        //
        //
        //         setRecipients(prevRecipients => [...prevRecipients, createdRecipient.data]);
        //
        //
        //         // await loadRecipients(selectedAcc.id);
        //     } catch (error) {
        //         console.error("Error adding recipient:", error);
        //     }
        // };




    };


    useEffect(() => {
        loadPaymentCodes();
    }, []);

    const loadPaymentCodes = async () => {
        try {
            const data = await getPaymentCodes();
            setPaymentCodes(data.data.codes);
        } catch (err) {
            console.error("Failed to fetch accounts:", err);
        }

    };




    const [newPayment, setNewPayment] = useState({
        payerAccount: "",
        recipientName: recipient ? `${recipient.firstName} ${recipient.lastName}`.trim() : "",
        recipientAccount: recipient?.accountNumber || "",
        paymentCode: "289",
        paymentPurpose: "",
        amount: "",
        address: "",
        referenceNumber: "",
    });


    const [openModal, setOpenModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [toggleSuccess, setToggleSuccess] = useState(true);
    const [users, setUsers] = useState([]);



    const handleCreatePayment = async (e) => {
        e.preventDefault();

        if (!selectedAccount || !newPayment.recipientAccount || !newPayment.amount || !newPayment.recipientName) {
            toast.error("Molimo popunite sva obavezna polja.");
            return;
        }

        // Logovanje podataka
        const transferData = {
            fromAccountNumber: selectedAccount.accountNumber,
            recipientAccount: newPayment.recipientAccount,
            amount: parseFloat(newPayment.amount),
            receiver: newPayment.recipientName,
            adress: newPayment.adress,
            payementCode: newPayment.paymentCode,
            payementReference: newPayment.referenceNumber,
            payementDescription: newPayment.paymentPurpose
        };

        console.log("Data za slanje:", transferData);
        try {
            const result = await createNewMoneyTransfer(transferData);

            if (result.success) {
                toast.success(result.data.message || "Uspešno ste izvršili uplatu!");
                setIsSuccess(true);
                setPaymentMessage(result.data?.reason || result.data?.message || "Payment completed successfully.");
            } else {
                toast.error(result.error || "Greška prilikom uplate.");
                setIsSuccess(false);
                setPaymentMessage(result.data?.reason || result.error || "Payment failed. Please try again.");
            }
        } catch (error) {
            toast.error("Došlo je do greške. Pokušajte ponovo.");
            setIsSuccess(false);
            setPaymentMessage(error.response?.data?.reason || error.response?.data?.message || "Unexpected error occurred. Please try again later.");
        }

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
                            value={selectedAccount ? selectedAccount.id : ""}
                            onChange={(e) => handleAccountSelection(e.target.value)}
                        >
                            <option value="" disabled>Select an account</option>
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.accountNumber}
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
                                getOptionLabel={(option) => {
                                    if (!option) return "";
                                    const firstName = option.firstName || '';
                                    const lastName = option.lastName || '';
                                    const label = `${firstName} ${lastName}`.trim();

                                    if (label === "undefined undefined") {
                                        return "";
                                    }

                                    return label;
                                }}
                                isOptionEqualToValue={(option, value) => option?.accountNumber === value?.accountNumber}
                                value={
                                    (newPayment.recipientAccount && recipients.find(rec => rec.accountNumber === newPayment.recipientAccount)) ||
                                    (newPayment.recipientName ? {
                                        firstName: newPayment.recipientName.split(" ")[0] || "",
                                        lastName: newPayment.recipientName.split(" ")[1] || "",
                                        accountNumber: ""
                                    } : null)
                                }
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
                                            recipientName: `${value.firstName ?? ""} ${value.lastName ?? ""}`.trim(),
                                            recipientAccount: value.accountNumber,
                                        });
                                    } else {
                                        setNewPayment({
                                            ...newPayment,
                                            recipientName: "",
                                            recipientAccount: "",
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
                                onChange={(e) => setNewPayment({ ...newPayment, paymentCode: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select a payment code</option>
                                {paymentCodes.map((code) => (
                                    <option key={code.code} value={code.code}>
                                        {code.code} - {code.description}
                                    </option>
                                ))}
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

                <PaymentResultModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    success={isSuccess}
                    paymentMessage={paymentMessage}
                    onConfirm={handleConfirm}
                />
            </div>
        </div>
    );
};

export default NewPaymentPortal;
