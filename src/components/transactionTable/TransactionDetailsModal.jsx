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

//Ovo je za font da kad se čuva može i ćirilica
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const TransactionDetailsModal = ({ open, onClose, transaction }) => {
    if (!transaction) return null;

    const formatValue = (value) => (value !== null && value !== undefined ? value : "N/A");

    // Funkcija za generisanje i preuzimanje PDF
    const handleDownloadPDF = () => {
        const formattedDate = new Date(transaction.date).toISOString().split("T")[0];

        // Bezbedno uzimanje imena primaoca - ako nije string, koristi "Unknown_Receiver"
        const receiverName =
            typeof transaction.receiver === "string"
                ? transaction.receiver.replace(/\s+/g, "_")
                : "Unknown_Receiver";

        const fileName = `TransactionReport.pdf`;

        const docDefinition = {
            content: [
                { text: "Transaction Report", style: "header" },
                { text: "\n" },
                {
                    table: {
                        widths: ["40%", "60%"],
                        body: [
                            ["Transaction ID", formatValue(transaction.id)],
                            ["Sender Name", formatValue(transaction.sender)],
                            ["Sender Account", formatValue(transaction.senderAccount)],
                            ["Recipient Name", formatValue(transaction.receiver)],
                            ["Recipient Account", formatValue(transaction.receiverAccount)],
                            ["Payment Purpose", formatValue(transaction.paymentPurpose)],
                            ["Amount", `${formatValue(transaction.amount)} `],
                            ["Payment Code", formatValue(transaction.paymentCode)],
                            ["Reference Number", formatValue(transaction.referenceNumber)],
                            ["Date & Time", `${formatValue(transaction.date)} at ${formatValue(transaction.time)}`]
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
        // Download PDF-a
        pdfMake.createPdf(docDefinition).download(fileName);
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
                            <TextField fullWidth label="Transaction ID" value={formatValue(transaction.id)} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Sender Name" value={formatValue(transaction.sender)} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Sender Account" value={formatValue(transaction.senderAccount)} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Recipient Name" value={formatValue(transaction.receiver)} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Recipient Account" value={formatValue(transaction.receiverAccount)} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Payment Purpose" value={formatValue(transaction.paymentPurpose)} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Amount" value={`${formatValue(transaction.amount)} `} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Payment Code" value={formatValue(transaction.paymentCode)} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Reference Number" value={formatValue(transaction.referenceNumber)} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Loan ID" value={formatValue(transaction.loanId)} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Date & Time" value={`${formatValue(transaction.date)} at ${formatValue(transaction.time)}`} InputProps={{ readOnly: true }} />
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