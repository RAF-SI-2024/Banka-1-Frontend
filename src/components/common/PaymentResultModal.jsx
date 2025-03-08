import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "../../styles/PaymentResultModal.css";

const PaymentResultModal = ({ open, onClose, success, onConfirm, paymentMessage }) => {
    return (
        <Dialog open={open} onClose={onClose} className="payment-modal">
            <div className="payment-modal-content">
                <DialogTitle className="modal-title">
                    {success ? "Transaction Successful" : "Transaction Failed"}
                </DialogTitle>

                <DialogContent>
                    <Typography variant="h6" className="modal-reason">Reason</Typography>

                    <Typography variant="body1" className="modal-message">
                        {paymentMessage} {/* Prikazuje poruku iz backend-a */}
                    </Typography>

                    {success && (
                        <Typography variant="body1" className="modal-message">
                            Do you want to add this recipient to your list?
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions className="modal-buttons">
                    {success && (
                        <Button className="confirm-button" onClick={onConfirm}>
                            Confirm
                        </Button>
                    )}
                    <Button className="cancel-button" onClick={onClose}>
                        Back
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );
};


export default PaymentResultModal;


