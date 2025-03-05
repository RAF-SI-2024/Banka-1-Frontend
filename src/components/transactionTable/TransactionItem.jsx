import React from "react";
import { TableRow, TableCell, Avatar, Tooltip } from "@mui/material";

// Komponenta prikazuje jednu transakciju u tabeli

const TransactionItem = ({ transaction, onDoubleClick }) => {
    const receiverName = transaction.receiver || "Unknown Account";

    // Funkcija za Avatar(prvo slovo imena)
    const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

    return (
        <TableRow
            onDoubleClick={onDoubleClick}
            sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#44475a" } }}
        >
            {/* Prikaz primaoca sa avatarom */}
            <TableCell sx={{ color: "#fff", display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title={receiverName} arrow>
                    <Avatar sx={{ bgcolor: "#efefef", color: "#000", fontWeight: "bold" }}>
                        {getInitial(receiverName)}
                    </Avatar>
                </Tooltip>
                {receiverName}
            </TableCell>
            {/* Status transakcije */}
            <TableCell sx={{ color: "#fff" }}>{transaction.status || "N/A"}</TableCell>
            {/* Iznos transakcije sa valutom*/}
            <TableCell sx={{ color: "#fff", textAlign: "right" }}>
                {transaction.amount ? `${transaction.amount} ${transaction.currency || ""}` : "N/A"}
            </TableCell>
        </TableRow>
    );
};

export default TransactionItem;