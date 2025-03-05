import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    TextField,
    Button,
    Box
} from "@mui/material";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const TransactionDetailsModal = ({ open, onClose, transaction }) => {
    if (!transaction) return null;

    const handleDownloadPDF = () => {
        const docDefinition = {
            content: [
                { text: "Transaction Report", style: "header" },
                { text: "\n" },
                {
                    table: {
                        widths: ["40%", "60%"],
                        body: [
                            ["Sender Name", transaction.sender],
                            ["Sender Account", transaction.senderAccount],
                            ["Recipient Name", transaction.receiver],
                            ["Recipient Account", transaction.receiverAccount],
                            ["Payment Purpose", transaction.paymentPurpose],
                            ["Amount", `${transaction.amount} ${transaction.currency}`],
                            ["Payment Code", transaction.paymentCode],
                            ["Reference Number", transaction.referenceNumber],
                            ["Date & Time", `${transaction.date} at ${transaction.time}`]
                        ]
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: "center",
                    marginBottom: 10
                }
            }
        };

        pdfMake.createPdf(docDefinition).download(`Transaction_${transaction.id}.pdf`);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", backgroundColor: "#1e1e2e", color: "#fff" }}>
                Transaction Details
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: "#1e1e2e" }}>
                <Box sx={{
                    width: "100%",
                    padding: 3,
                    backgroundColor: "#1e1e2e",
                    borderRadius: 2,
                    border: "2px solid #2c2f3f"
                }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Sender Name" value={transaction.sender} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Sender Account" value={transaction.senderAccount} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Recipient Name" value={transaction.receiver} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Recipient Account" value={transaction.receiverAccount} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Payment Purpose" value={transaction.paymentPurpose} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Amount" value={`${transaction.amount} ${transaction.currency}`} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Payment Code" value={transaction.paymentCode} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Reference Number" value={transaction.referenceNumber} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Date & Time" value={`${transaction.date} at ${transaction.time}`} InputProps={{ readOnly: true }} />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <Button variant="contained" onClick={onClose} sx={{ bgcolor: "#F4D03F", color: "#000", "&:hover": { bgcolor: "#F1C40F" } }}>
                        CLOSE
                    </Button>
                    <Button variant="contained" onClick={handleDownloadPDF} sx={{ bgcolor: "#4CAF50", color: "#fff", "&:hover": { bgcolor: "#388E3C" } }}>
                        Print
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionDetailsModal;
/*import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography } from "@mui/material";

const TransactionDetailsModal = ({ open, onClose, transaction }) => {
    if (!transaction) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ backgroundColor: "#121212", color: "#fff", textAlign: "center" }}>
                Detalji transakcije
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: "#121212", color: "#fff", padding: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="gray">Pošiljalac</Typography>
                        <Typography variant="body1">{transaction.sender}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="gray">Račun pošiljaoca</Typography>
                        <Typography variant="body1">{transaction.senderAccount}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="gray">Primalac</Typography>
                        <Typography variant="body1">{transaction.receiver}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="gray">Račun primaoca</Typography>
                        <Typography variant="body1">{transaction.receiverAccount}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="gray">Iznos</Typography>
                        <Typography variant="body1">{`${transaction.amount} ${transaction.currency}`}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="gray">Status</Typography>
                        <Typography variant="body1">{transaction.status}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="gray">Datum i vreme</Typography>
                        <Typography variant="body1">{`${transaction.date} u ${transaction.time}`}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="gray">Svrha plaćanja</Typography>
                        <Typography variant="body1">{transaction.paymentPurpose}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="gray">Šifra plaćanja</Typography>
                        <Typography variant="body1">{transaction.paymentCode}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="gray">Poziv na broj</Typography>
                        <Typography variant="body1">{transaction.referenceNumber}</Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "#121212" }}>
                <Button onClick={onClose} variant="contained" sx={{ bgcolor: "#F4D03F", color: "#000", '&:hover': { bgcolor: "#F1C40F" } }}>
                    Zatvori
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransactionDetailsModal;

 */
