import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, TextField, Checkbox, FormControlLabel } from "@mui/material";
import {createOrder} from "../../services/AxiosTrading";
import MenuItem from "@mui/material/MenuItem";
import {fetchAccountsForUser, getUserIdFromToken} from "../../services/AxiosBanking";

const BuyModal = ({ open, onClose, security }) => {
    const [quantity, setQuantity] = useState(1);
    const [limitValue, setLimitValue] = useState("");
    const [stopValue, setStopValue] = useState("");
    const [allOrNone, setAllOrNone] = useState(false);
    const [margin, setMargin] = useState(false);
    const [isOverview, setIsOverview] = useState(false);
    const [orderType, setOrderType] = useState("market");
    const [pricePerUnit, setPricePerUnit] = useState(0);
    const contractSize = security?.contractSize || 1; // Podrazumevana vrednost ako nije definisana
    const [approximatePrice, setApproximatePrice] = useState(0);
    const [accounts, setAccounts] = useState([]);
    const [outflowAccount, setOutflowAccount] = useState('');

    useEffect(() => {
        if (open) {
            console.log("Selected Security Object:", security);
        }
    }, [open, security]);

    //racuni klijenta
    useEffect(() => {
        const getAccounts = async () => {
            try {
                const response = await fetchAccountsForUser();

                setAccounts(response);
                console.log(accounts);

            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };
        getAccounts();
    }, []);

    // ako je account selektovan, uzima se valuta
    const selectedOutflow = accounts.find(acc => acc.id === outflowAccount);
    const currency = selectedOutflow ? selectedOutflow.currencyType : '';

    //resetovanje modala
    useEffect(() => {
        if (!open) {
            setOutflowAccount("");
            setQuantity(1);
            setLimitValue("");
            setStopValue("");
            setAllOrNone(false);
            setMargin(false);
            setIsOverview(false);
            setOrderType("market");
        }
    }, [open]);

    //odredjivanje tipa ordera i cene
    useEffect(() => {
        let newPricePerUnit = security?.lastPrice || 0;

        if (limitValue && stopValue) {
            setOrderType("stop-limit");
            newPricePerUnit = limitValue;
        } else if (limitValue) {
            setOrderType("limit");
            newPricePerUnit = limitValue;
        } else if (stopValue) {
            setOrderType("stop");
            newPricePerUnit = stopValue;
        } else {
            setOrderType("market");
        }

        setPricePerUnit(newPricePerUnit);
        setApproximatePrice(contractSize * newPricePerUnit * quantity);
    }, [limitValue, stopValue, security, quantity]);



    //kolicina ne moze da bude manja od 1
    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        }
    };

    // proveriti orderData
    const handleConfirm = async () => {

        const orderData = {
            account_id: outflowAccount,
            aon:allOrNone,
            contract_size: contractSize,
            direction: "Buy",
            limit_price_per_unit: limitValue ? parseFloat(limitValue) : null,
            margin: margin,
            quantity: parseInt(quantity, 10),
            security_id: security?.id,
            stop_price_per_unit : stopValue ? parseFloat(stopValue) : null,
            user_id: getUserIdFromToken()
        };

        console.log("Order Data:", orderData);

        try {
            const result = await createOrder(orderData);
            console.log("Order created successfully:", result);
            onClose();
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };


    return (
        <Modal open={open} onClose={onClose} aria-labelledby="buy-modal-title">
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    textAlign: "center",
                }}
            >
                {!isOverview ? (
                    <>
                        <Typography id="buy-modal-title" variant="h6">
                            Buy Security
                        </Typography>

                        {/* Account Select */}
                        <TextField
                            id="outflow-account"
                            select
                            label="Select Account"
                            value={outflowAccount}
                            onChange={(e) => {
                                setOutflowAccount(Number(e.target.value));
                            }}
                            fullWidth
                            variant="standard"

                        >
                            {accounts.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.accountNumber}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Quantity */}
                        <TextField
                            label="Quantity"
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            inputProps={{ min: 1 }}
                            fullWidth
                            sx={{ mt: 2 }}
                            variant="standard"

                        />

                        {/* Limit Value */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                label="Limit Value"
                                type="number"
                                value={limitValue}
                                onChange={(e) => setLimitValue(e.target.value)}
                                fullWidth
                                sx={{ mt: 2 }}
                                variant="standard"

                            />
                        </Box>

                        {/* Stop Value */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                label="Stop Value"
                                type="number"
                                value={stopValue}
                                onChange={(e) => setStopValue(e.target.value)}
                                fullWidth
                                sx={{ mt: 2 }}
                                variant="standard"

                            />

                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", mt: 2 }}>
                            <FormControlLabel
                                control={<Checkbox checked={allOrNone} onChange={(e) => setAllOrNone(e.target.checked)} />}
                                label="All or None"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={margin} onChange={(e) => setMargin(e.target.checked)} />}
                                label="Margin"
                            />
                        </Box>

                        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                            <Button variant="outlined" color="secondary" onClick={onClose}>
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsOverview(true)}
                                disabled={!outflowAccount}
                            >
                                Continue
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h6">Order Overview</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            <strong>Quantity:</strong> {quantity}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Order Type:</strong> {orderType} order
                        </Typography>
                        <Typography variant="body1">
                            <strong>Approximate Price:</strong> {approximatePrice.toFixed(2)}
                        </Typography>

                        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                            <Button variant="outlined" color="secondary" onClick={() => setIsOverview(false)}>
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleConfirm}>
                                Confirm
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default BuyModal;