import React from "react";
import { TableRow, TableCell, Avatar, Tooltip } from "@mui/material";

// Komponenta prikazuje jednu transakciju u tabeli
const TransactionItem = ({ transaction, onDoubleClick }) => {
    const receiverName = transaction.receiverName || "Unknown";
    const amount = transaction.amount ? `${transaction.amount} ${transaction.currency || ""}` : "0.00";
    const status = transaction.status || "Pending";

    const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

    return (
        <TableRow
            onDoubleClick={onDoubleClick}
            sx={{
                cursor: onDoubleClick ? "pointer" : "default",
                "&:hover": { backgroundColor: "#44475a" },
            }}
        >
            <TableCell sx={{ color: "#fff", display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title={receiverName} arrow>
                    <Avatar sx={{ bgcolor: "#efefef", color: "#000", fontWeight: "bold" }}>
                        {getInitial(receiverName)}
                    </Avatar>
                </Tooltip>
                {receiverName}
            </TableCell>
            <TableCell sx={{ color: "#fff" }}>{status}</TableCell>
            <TableCell sx={{ color: "#fff", textAlign: "right" }}>{amount}</TableCell>
        </TableRow>
    );
};

export default TransactionItem;