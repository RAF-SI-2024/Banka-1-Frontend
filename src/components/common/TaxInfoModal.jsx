import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const TaxInfoModal = ({ open, onClose, taxData }) => {
    const [paidTax, setPaidTax] = useState(null);
    const [unpaidTax, setUnpaidTax] = useState(null);

    useEffect(() => {
        if (open) {
            setPaidTax(taxData.paid_this_year);
            setUnpaidTax(taxData.unpaid_this_month)
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Tax Information</DialogTitle>
            <DialogContent>
                <Typography variant="h6" textAlign="center" sx={{ mt: 2 }}>
                    Paid Tax This Year: <strong>${paidTax !== null ? paidTax.toFixed(2) : "Loading..."}</strong>
                </Typography>
                <Typography variant="h6" textAlign="center" sx={{ mt: 2, color: "red" }}>
                    Unpaid Tax This Month: <strong>${unpaidTax !== null ? unpaidTax.toFixed(2) : "Loading..."}</strong>
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>BACK</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaxInfoModal;
