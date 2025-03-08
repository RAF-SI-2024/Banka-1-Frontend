import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";


const LoanDetailsModal = ({ open, onClose, loan }) => {
    if (!loan) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ "& .MuiDialog-paper": { width: "50vw", maxWidth: "600px" } }}>
        <DialogTitle>
                <strong style={{ fontSize: "28px"}}>Loan Details</strong>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3.5} sx={{ mt: 1 }}>
                    {[
                        { label: "Loan Number", value: loan.loanNumber },
                        { label: "Loan Type", value: loan.loanType },
                        { label: "Total Amount", value: loan.totalAmount },
                        { label: "Repayment Period", value: loan.repaymentPeriod },
                        { label: "Nominal Interest Rate", value: `${loan.nominalInterestRate}%` },
                        { label: "Effective Interest Rate", value: `${loan.effectiveInterestRate}%` },
                        { label: "Contract Date", value: loan.contractDate },
                        { label: "Final Payment Date", value: loan.finalPaymentDate },
                        { label: "Next Installment Amount", value: loan.nextInstallmentAmount },
                        { label: "Next Installment Date", value: loan.nextInstallmentDate },
                        { label: "Remaining Debt", value: loan.remainingDebt },
                        { label: "Currency", value: loan.currency },
                    ].map((field, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontSize: "18px", fontWeight: "bold" }}
                            >
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
