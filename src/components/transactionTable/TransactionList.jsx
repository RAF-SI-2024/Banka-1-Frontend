import React, { useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import TransactionItem from "./TransactionItem";
import TransactionDetailsModal from "./TransactionDetailsModal";

// Komponenta  prikazuje listu transakcija u tabeli
const TransactionList = ({ transactions }) => {
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    return (
        <Box>
            <Table sx={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#282a36" }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Sender</TableCell>
                        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
                        <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "right" }}>Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TransactionItem
                            key={transaction.id}
                            transaction={transaction}
                            onDoubleClick={() => setSelectedTransaction(transaction)}
                        />
                    ))}
                </TableBody>
            </Table>
            {/* Prikaz modala sa detaljima transakcije ako je neka selektovana */}
            {selectedTransaction && (
                <TransactionDetailsModal
                    open={Boolean(selectedTransaction)}
                    onClose={() => setSelectedTransaction(null)}
                    transaction={selectedTransaction}
                />
            )}
        </Box>
    );
};

export default TransactionList;