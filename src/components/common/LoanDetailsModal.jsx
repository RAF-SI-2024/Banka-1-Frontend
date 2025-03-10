import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { fetchLoanDetails } from "../../services/AxiosBanking"; // API poziv

const LoanDetailsModal = ({ open, onClose, loanId }) => {
    const [loanDetails, setLoanDetails] = useState(null);
    const [loading, setLoading] = useState(true);
/*
    useEffect(() => {
        if (open && loanId) {
            const loadLoanDetails = async () => {
                setLoading(true);
                try {
                    const response = await fetchLoanDetails(loanId);
                    setLoanDetails(response.data.loan); // Dobijanje podataka iz API-ja
                } catch (error) {
                    console.error("Error fetching loan details:", error);
                } finally {
                    setLoading(false);
                }
            };

            loadLoanDetails();
        }
    }, [open, loanId]);
*/

    // Test podaci koji simuliraju API odgovor
    const testLoanDetails = {
        id: loanId || 1,
        loanType: "CASH",
        loanAmount: 500000,
        duration: 24,
        nominalRate: 5.5,
        effectiveRate: 6.0,
        createdDate: 1741545198899,
        allowedDate: 1742149998899,
        monthlyPayment: 22000.0,
        nextPaymentDate: 1744137198899,
        remainingAmount: 500000.0,
        currencyType: "RSD",
    };

    useEffect(() => {
        if (open && loanId) {
            setLoading(true);
            setTimeout(() => {
                setLoanDetails(testLoanDetails); // Simulacija učitavanja podataka
                setLoading(false);
            }, 500); // Dodali smo malo kašnjenje radi realističnog prikaza učitavanja
        }
    }, [open, loanId]);

//do ovde
    if (!open) return null;
    if (loading) return <Dialog open={open} onClose={onClose}><DialogTitle>Loading...</DialogTitle></Dialog>;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ "& .MuiDialog-paper": { width: "50vw", maxWidth: "600px" } }}>
            <DialogTitle>
                <strong style={{ fontSize: "28px" }}>Loan Details</strong>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3.5} sx={{ mt: 1 }}>
                    {loanDetails && [
                        { label: "Loan Number", value: loanDetails.id },
                        { label: "Loan Type", value: loanDetails.loanType },
                        { label: "Loan Amount", value: loanDetails.loanAmount },
                        { label: "Repayment Period", value: loanDetails.duration },
                        { label: "Nominal Interest Rate", value: `${loanDetails.nominalRate}%` },
                        { label: "Effective Interest Rate", value: `${loanDetails.effectiveRate}%` },
                        { label: "Contract Date", value: new Date(loanDetails.createdDate).toLocaleDateString() },
                        { label: "Final Payment Date", value: new Date(loanDetails.allowedDate).toLocaleDateString() },
                        { label: "Next Payment Amount", value: loanDetails.monthlyPayment },
                        { label: "Next Payment Date", value: new Date(loanDetails.nextPaymentDate).toLocaleDateString() },
                        { label: "Remaining Debt", value: loanDetails.remainingAmount },
                        { label: "Currency", value: loanDetails.currencyType },
                    ].map((field, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Typography variant="subtitle1" sx={{ fontSize: "18px", fontWeight: "bold" }}>
                                {field.label}:
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: "17px" }}>
                                {field.value}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoanDetailsModal;
