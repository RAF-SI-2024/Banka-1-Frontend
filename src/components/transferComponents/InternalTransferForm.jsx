import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import VerificationModal from "./VerificationModal";
import { createInternalTransfer, verifyOTP, fetchAccountsForUser } from "../../services/AxiosBanking";

const InternalTransferForm = () => {
    const [accounts, setAccounts] = useState([]);
    const [outflowAccount, setOutflowAccount] = useState('');
    const [inflowAccount, setInflowAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    // Fetch accounts data
    useEffect(() => {
        const getAccounts = async () => {
            try {
                const response = await fetchAccountsForUser();
                if (response.data && response.data.accounts) {
                    setAccounts(response.data.accounts);
                }
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };
        getAccounts();
    }, []);


    // ako je outflow account selektovan, uzima se valuta
    const selectedOutflow = accounts.find(acc => acc.id === outflowAccount);
    const currency = selectedOutflow ? selectedOutflow.currencyType : '';

    // filter za inflow accounts po istoj valuti koju ima outflow account
    const filteredInflowAccounts = accounts.filter(account =>
        account.currencyType === currency && account.id !== outflowAccount
    );

    // azuriranje amount vrednosti, ako korisnik unese zarez
    const handleAmountChange = (e) => {
        let value = e.target.value;
        value = value.replace(',', '.');
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const resetForm = () => {
        setOutflowAccount('');
        setInflowAccount('');
        setAmount('');
    };

    const handleContinue = async () => {
        const transferData = {
            fromAccountId: outflowAccount,
            toAccountId: inflowAccount,
            amount: parseFloat(amount)
        };

        console.log("Transfer data: ", transferData);

        try {
            const response = await createInternalTransfer(transferData);

            // trebalo bi da je odgovor u formatu: { transferId: "neki-id" }
            const transactionId = response.data.transferId;

            console.log("Transaction ID: ", transactionId);

            // ako je transfer uspešan, postavlja se ID transakcije i prikazuje se modal
            setTransactionId(transactionId);
            setShowModal(true);

        } catch (error) {
            console.error("Error during transfer: ", error);
        }
    };


    const handleConfirm = async (verificationCode) => {
        console.log("Transfer confirmed with verification code: ", verificationCode);

        const otpVerificationData = {
            transferId: transactionId, // postavljen nakon sto se kreira transakcija
            otpCode: verificationCode
        };

        try {
            const response = await verifyOTP(otpVerificationData);
            if (response.status === 200) {
                console.log("Transaction successfully verified!");
                alert("Transaction successfully verified!");
                resetForm();
                setShowModal(false);
            } else {
                console.error("Invalid OTP or expired OTP.");
            }
        } catch (error) {
            if (error.response?.status === 401) {
                console.error("Invalid OTP code.");
                alert("Invalid OTP code.");
            } else if (error.response?.status === 408) {
                console.error("OTP code expired.");
                alert("OTP code expired.");
            } else {
                console.error("Error during OTP verification: ", error);
            }
        }
    };


    const handleCancel = () => {
        setShowModal(false);
        setVerificationCode('');
    };

    return (
        <div style={{ padding: '20px', marginTop: '64px' }}>
            <h1>New Internal Transfer</h1>

            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
                noValidate
                autoComplete="off"
            >
                {/* Outflow Account Select */}
                <TextField
                    id="outflow-account"
                    select
                    label="Outflow Account"
                    value={outflowAccount}
                    onChange={(e) => {
                        setOutflowAccount(Number(e.target.value));
                        setInflowAccount(''); // resetuje inflow account kada se outflow promeni
                    }}
                    helperText="Please select your outflow account"
                    variant="standard"
                >
                    {accounts.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.accountNumber}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Inflow Account Select */}
                <TextField
                    id="inflow-account"
                    select
                    label="Inflow Account"
                    value={inflowAccount}
                    onChange={(e) => setInflowAccount(Number(e.target.value))}
                    helperText="Please select your inflow account"
                    variant="standard"
                    disabled={!outflowAccount} // Disable ako outflow account nije selektovan
                >
                    {filteredInflowAccounts.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.accountNumber}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Input for amount and displaying the currency */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        id="amount"
                        label="Amount"
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        variant="standard"
                        sx={{ width: '25ch' }}
                        disabled={!outflowAccount} // Disable ako outflow account nije selektovan
                    />
                    <Typography variant="body1">
                        {currency} {/* valuta koju ima outflow account */}
                    </Typography>
                </Box>

                {/* Continue Button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleContinue}
                    disabled={!outflowAccount || !inflowAccount || !amount} // Disable ako forma nije popunjena
                    sx={{ width: '25ch' }}
                >
                    Continue
                </Button>
            </Box>
            {/* Verification Modal */}
            <VerificationModal
                open={showModal}
                onClose={handleCancel}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default InternalTransferForm;
