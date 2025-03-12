import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { fetchLoanDetails, fetchRemainingInstallments } from "../../services/AxiosBanking";

const LoanDetailsModal = ({ open, onClose, loanId }) => {
    const [loanDetails, setLoanDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open && loanId) {
            const loadLoanDetails = async () => {
                setLoading(true);
                try {
                    const loanResponse = await fetchLoanDetails(loanId);
                    const installmentsResponse = await fetchRemainingInstallments(loanId);

                    setLoanDetails({
                        ...loanResponse.data.loan, // Information about loan
                        remainingInstallments: installmentsResponse.data // Number of remaining installments
                    });
                } catch (error) {
                    console.error("Error fetching loan details:", error);
                } finally {
                    setLoading(false);
                }
            };

            loadLoanDetails();
        }
    }, [open, loanId]);

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
                        { label: "Remaining Debt", value: loanDetails.remainingAmount },
                        { label: "Remaining Installments", value: loanDetails.remainingInstallments },
                        { label: "Nominal Interest Rate", value: `${loanDetails.nominalRate}%` },
                        { label: "Effective Interest Rate", value: `${loanDetails.effectiveRate}%` },
                        { label: "Contract Date", value: new Date(loanDetails.createdDate).toLocaleDateString() },
                        { label: "Final Payment Date", value: new Date(loanDetails.allowedDate).toLocaleDateString() },
                        { label: "Next Installment Amount", value: loanDetails.monthlyPayment },
                        { label: "Next Installment Date", value: new Date(loanDetails.nextPaymentDate).toLocaleDateString() },
                        { label: "Currency", value: loanDetails.currencyType },
                        { label: "Loan Amount", value: loanDetails.loanAmount },
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
