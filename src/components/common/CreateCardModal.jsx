import React, {useEffect, useState} from "react";
import {Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography} from "@mui/material";
import {useCards} from "../../context/CardContext";
import {fetchAccountsId1, getUserIdFromToken} from "../../services/AxiosBanking";

const CreateCardModal = ({open, onClose, accountId}) => {
    const {addCard} = useCards();
    const [selectedAccount, setSelectedAccount] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch available accounts when modal opens
    useEffect(() => {
        const loadAccounts = async () => {
            setLoading(true);
            try {
                const userId = getUserIdFromToken();

                if (userId) {
                    const accounts = await fetchAccountsId1(userId)
                    if (Array.isArray(accounts)) {
                        setAccounts(accounts);
                    }
                }
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
            setLoading(false);
        };

        if (open) loadAccounts().then();
    }, [open, accountId]);

    const handleCreateCard = async () => {
        if (!selectedAccount) return;

        try {
            await addCard(selectedAccount, selectedType, selectedBrand);
            onClose();
        } catch (error) {
            console.error("Error creating card:", error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "#1c1f2b",
                    color: "white",
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                }}
            >
                <Typography variant="h6" sx={{mb: 2, textAlign: "center", fontWeight: "bold"}}>
                    Create new card
                </Typography>

                <FormControl fullWidth disabled={loading || accounts.length === 0}>
                    <InputLabel>Select account</InputLabel>
                    <Select
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        displayEmpty
                     variant="outlined">
                        {accounts.length > 0 ? (
                            accounts.map((acc) => (
                                <MenuItem key={acc.id} value={acc.id}>
                                    {acc.number}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No accounts available</MenuItem>
                        )}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{my: 2}} disabled={loading || accounts.length === 0}>
                    <InputLabel>Choose card type</InputLabel>
                    <Select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        displayEmpty
                        variant="outlined">
                        <MenuItem key="DEBIT" value="DEBIT">Debit</MenuItem>
                        <MenuItem key="CREDIT" value="CREDIT">Credit</MenuItem>
                    </Select>

                </FormControl>
                <FormControl fullWidth disabled={loading || accounts.length === 0}>
                    <InputLabel>Choose card brand</InputLabel>
                    <Select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        displayEmpty
                        variant="outlined">
                        <MenuItem key="VISA" value="VISA">Visa</MenuItem>
                        <MenuItem key="MASTERCARD" value="MASTERCARD">Mastercard</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{display: "flex", justifyContent: "space-between", mt: 2}}>
                    <Button variant="contained" color="error" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleCreateCard} disabled={!selectedAccount}>
                        Confirm
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateCardModal;
