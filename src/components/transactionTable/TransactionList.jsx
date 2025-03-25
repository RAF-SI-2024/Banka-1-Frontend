import React, { useState } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TransactionItem from "./TransactionItem";
import TransactionDetailsModal from "./TransactionDetailsModal";

const TransactionList = ({ transactions = [] }) => {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    return (
        <Box>
            {transactions.length === 0 ? (
                <Typography
                    sx={{
                        color: isDarkMode ? "#fff" : "#333",
                        textAlign: "center",
                        padding: 2
                    }}
                >
                    No transactions available.
                </Typography>
            ) : (
                <Table
                    sx={{
                        width: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: isDarkMode ? "#131318" : "#f9f9f9"
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{ color: isDarkMode ? "#fff" : "#000", fontWeight: "bold" }}
                            >
                                Sender
                            </TableCell>
                            <TableCell
                                sx={{ color: isDarkMode ? "#fff" : "#000", fontWeight: "bold" }}
                            >
                                Status
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: isDarkMode ? "#fff" : "#000",
                                    fontWeight: "bold",
                                    textAlign: "right"
                                }}
                            >
                                Amount
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction, index) => (
                            <TransactionItem
                                key={`${transaction.id}-${index}`}
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