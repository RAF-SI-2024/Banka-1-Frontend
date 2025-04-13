import React from "react";
import { Modal, Box, Typography, TextField, Button, Alert } from "@mui/material";

const AddFastPayment = ({ open, onClose, onAddRecipient, recipient, setRecipient, error }) => {
    return (

        /* Modal za dodavanje novog primaoca */
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                width: 600,
                padding: 2,
                margin: "auto",
                marginTop: "20%",
                backgroundColor: "#1e1e2e",
                borderRadius: 1
            }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
                    Add Recipient
                </Typography>

                <Box sx={{ borderRadius: 2, border: "2px solid #2c2f3f", padding: 3 }}>
                    {/* Text field za ime novog fast primaoca*/}
                    <TextField
                        required
                        label="Recipient Name"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={recipient.name}
                        onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                    />
                    {/* Text field za account prima samo brojeve*/}
                    <TextField
                        required
                        type="number"
                        label="Account Number"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={recipient.accountNumber}
                        onChange={(e) => setRecipient({ ...recipient, accountNumber: e.target.value })}
                    />
                </Box>

                {/* Ako nisu popunjena oba polja izlazi error*/}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Submit ili cancel dugmmici*/}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                    <Button variant="outlined" onClick={onClose} color="error">
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={onAddRecipient} color="success">
                        Add
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddFastPayment;
