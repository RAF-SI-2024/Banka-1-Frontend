import React from "react";
import { TableRow, TableCell, Avatar, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const TransactionItem = ({ transaction, onDoubleClick }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    const receiverName = transaction.receiverName || "Unknown";
    const amount = transaction.amount
        ? `${transaction.amount} `
        : "0.00";
    const status = transaction.status || "Pending";

    const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

    return (
        <TableRow
            onDoubleClick={onDoubleClick}
            sx={{
                cursor: onDoubleClick ? "pointer" : "default",
                "&:hover": {
                    backgroundColor: isDarkMode ? "#44475a" : "#f0f0f0",
                },
            }}
        >
            <TableCell
                sx={{
                    color: isDarkMode ? "#fff" : "#000",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Tooltip title={receiverName} arrow>
                    <Avatar
                        sx={{
                            bgcolor: isDarkMode ? "#eee" : "#444",
                            color: isDarkMode ? "#000" : "#fff",
                            fontWeight: "bold",
                        }}
                    >
                        {getInitial(receiverName)}
                    </Avatar>
                </Tooltip>
                {receiverName}
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? "#fff" : "#000" }}>
                {status}
            </TableCell>
            <TableCell
                sx={{
                    color: isDarkMode ? "#fff" : "#000",
                    textAlign: "right",
                }}
            >
                {amount}
            </TableCell>
        </TableRow>
    );
};

export default TransactionItem;