import React, { useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Box, Typography } from "@mui/material";
import TransactionItem from "./TransactionItem";
import TransactionDetailsModal from "./TransactionDetailsModal";

const TransactionList = ({ transactions = [] }) => {
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    return (
        <Box>
            {transactions.length === 0 ? (
                <Typography sx={{ color: "#fff", textAlign: "center", padding: 2 }}>
                    No transactions available.
                </Typography>
            ) : (
                <Table sx={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#282a36" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Sender</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "right" }}>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction, index) => (
                            <TransactionItem
                                key={`${transaction.id}-${index}`} // Unikatni key
                                transaction={transaction}
                                onDoubleClick={() => setSelectedTransaction(transaction)}
                            />
                        ))}
                    </TableBody>
                </Table>
            )}
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