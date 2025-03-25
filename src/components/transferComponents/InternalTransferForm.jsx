import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import { createInternalTransfer, verifyOTP, fetchAccountsForUser, fetchExchangeRatesForCurrency } from "../../services/AxiosBanking";
import { useNavigate } from "react-router-dom";

const InternalTransferForm = () => {
    const [accounts, setAccounts] = useState([]);
    const [outflowAccount, setOutflowAccount] = useState('');
    const [inflowAccount, setInflowAccount] = useState('');
    const [outflowAccountNumber, setOutflowAccountNumber] = useState('');
    const [inflowAccountNumber, setInflowAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [modalStep, setModalStep] = useState('details');
    const [showModal, setShowModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const navigate = useNavigate();
    const [exchangeRate, setExchangeRate] = useState(1);


    useEffect(() => {
        const getAccounts = async () => {
            try {
                const response = await fetchAccountsForUser();
                setAccounts(response);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };
        getAccounts();
    }, []);

    const selectedOutflow = accounts.find(acc => acc.id === outflowAccount);
    const selectedInflow = accounts.find(acc => acc.id === inflowAccount);
    const currency = selectedOutflow ? selectedOutflow.currencyType : '';
    const currency2 = selectedInflow ? selectedInflow.currencyType : '';
    const conversion = currency != currency2;
    const filteredInflowAccounts = accounts.filter(account => account.id !== outflowAccount);

    const handleOutflowChange = (e) => {
        const selectedAccount = accounts.find(acc => acc.id === Number(e.target.value));
        setOutflowAccount(selectedAccount.id);
        setOutflowAccountNumber(selectedAccount.accountNumber);
        setInflowAccount('');
        setInflowAccountNumber('');
    };

    const handleInflowChange = (e) => {
        const selectedAccount = accounts.find(acc => acc.id === Number(e.target.value));
        setInflowAccount(selectedAccount.id);
        setInflowAccountNumber(selectedAccount.accountNumber);
    };


    const handleAmountChange = (e) => {
        let value = e.target.value.replace(',', '.');
        if (/^\d*\.?\d*$/.test(value)) setAmount(value);
    };

    const handleContinue = async () => {
        setShowModal(true);
        setModalStep('details');

        try {
            const response = await fetchExchangeRatesForCurrency(currency);
            const rate = response.data.rates.find(rate => rate.targetCurrency === currency2);
            if (rate) {
                setExchangeRate(rate.exchangeRate);
            }
            else setExchangeRate(1);
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
        }
    };

    const handleConfirmTransfer = async () => {
        const transferData = {
            fromAccountId: outflowAccount,
            toAccountId: inflowAccount,
            amount: parseFloat(amount) };
        try {
            const response = await createInternalTransfer(transferData);
            setTransactionId(response.data.transferId);
            setModalStep('verification');
        } catch (error) {
            console.error("Error during transfer:", error);
        }
    };

    const handleConfirmVerification = async () => {
        try {
            const response = await verifyOTP(
                {
                    transferId: transactionId,
                    otpCode: verificationCode
                });
            if (response.status === 200) {
                alert("Transaction successfully verified!");
                setShowModal(false);
                navigate('/home');
            } else {
                alert("Invalid OTP.");
            }
        } catch (error) {
            alert("Error verifying OTP.");
        }
    };

    return (
        <div style={{padding: '20px', marginTop: '64px'}}>
            <h1>New Internal Transfer</h1>

            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': {m: 1, width: '25ch'},
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="outflow-account"
                    select
                    label="Outflow Account"
                    value={outflowAccount}
                    onChange={handleOutflowChange}
                    helperText="Please select your outflow account"
                >
                    {accounts.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.accountNumber} {/* Prikazujemo broj računa */}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    id="inflow-account"
                    select
                    label="Inflow Account"
                    value={inflowAccount}
                    onChange={handleInflowChange}
                    helperText="Please select your inflow account"
                    disabled={!outflowAccount}
                >
                    {filteredInflowAccounts.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.accountNumber} {/* Prikazujemo broj računa */}
                        </MenuItem>
                    ))}
                </TextField>


                {/* Input for amount and displaying the currency */}
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <TextField
                        id="amount"
                        label="Amount"
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        sx={{width: '25ch'}}
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
                    sx={{width: '25ch'}}
                >
                    Continue
                </Button>
            </Box>
            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={{
                    p: 4,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    width: 400,
                    margin: 'auto',
                    mt: '20vh'
                }}>
                    {modalStep === 'details' ? (
                        <>
                            <Typography variant="h6">Transfer Details</Typography>
                            <Typography><strong>From account:</strong> {outflowAccountNumber}</Typography>
                            <Typography><strong>Amount:</strong> {amount} {currency}</Typography>
                            <Typography><strong>To account:</strong> {inflowAccountNumber}</Typography>
                            <Typography>
                                <strong>Amount:</strong> {exchangeRate ? ((amount * exchangeRate) % 1 === 0 ? (amount * exchangeRate) : (amount * exchangeRate).toFixed(3)) : amount} {currency2}
                            </Typography>
                            <Typography>
                                <strong>Exchange rate:</strong> {exchangeRate ? (exchangeRate % 1 === 0 ? exchangeRate : exchangeRate.toFixed(3)) : '1'}
                            </Typography>
                            {!conversion && <Typography><strong>Transfer fee:</strong> 0.00 {currency}</Typography>}
                            {conversion && <Typography><strong>Transfer fee:</strong> {amount * 0.01} {currency}</Typography>}
                            <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                                <Button variant="outlined" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button variant="contained" onClick={handleConfirmTransfer}>Continue</Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6">Enter Verification Code</Typography>
                            <TextField label="Verification Code" value={verificationCode}
                                       onChange={(e) => setVerificationCode(e.target.value)} fullWidth/>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                                <Button variant="outlined" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button variant="contained" onClick={handleConfirmVerification}
                                        disabled={!verificationCode}>Confirm</Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default InternalTransferForm;