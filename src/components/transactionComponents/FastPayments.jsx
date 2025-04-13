import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Tooltip, Skeleton, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddFastPayment from "./AddFastPayment";
import {
    createRecipientt,
    fetchRecipientsForFast,
    getUserIdFromToken
} from "../../services/AxiosBanking";

const FastPayments = () => {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [recipient, setRecipient] = useState({ name: "", accountNumber: "" });
    const [recipientList, setRecipientList] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (userId) {
            const fetchTopRecipients = async () => {
                try {
                    setLoading(true);
                    const data = await fetchRecipientsForFast(userId);
                    setRecipientList(data);
                } catch (err) {
                    setError("Failed to load recipients.");
                } finally {
                    setLoading(false);
                }
            };
            fetchTopRecipients();
        } else {
            setError("User ID not found.");
            setLoading(false);
        }
    }, []);

    const handleAddRecipient = async () => {
        if (!recipient.name || !recipient.accountNumber) {
            setError("Both fields must be filled.");
            return;
        }

        const userId = getUserIdFromToken();
        if (!userId) {
            setError("User ID not found.");
            return;
        }

        const newRecipient = {
            ownerAccountId: null, // više nije vezan za račun
            accountNumber: recipient.accountNumber,
            fullName: recipient.name,
            address: recipient.address || ""
        };

        try {
            await createRecipientt(newRecipient);
            const updatedRecipients = await fetchRecipientsForFast(userId);
            setRecipientList(updatedRecipients);
            setOpenModal(false);
            setRecipient({ name: "", accountNumber: "" });
            setError("");
        } catch (err) {
            setError("Failed to add recipient.");
        }
    };

    const getInitials = (fullName) => {
        const parts = fullName?.trim()?.split(" ");
        const first = parts?.[0]?.charAt(0)?.toUpperCase() || "";
        const last = parts?.[1]?.charAt(0)?.toUpperCase() || "";
        return first + last;
    };

    return (
        <Box sx={{
            width: "max-content",
            borderRadius: 4,
            padding: 3,
            paddingLeft: "50px",
            bgcolor: "transparent",
            backdropFilter: "none",
            textAlign: "left",
            mb: 4
        }} >
            <Typography variant="h6" sx={{ mb: 2 }}>
                Fast Payments
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Box key={i} sx={{ display: "flex", gap: 2 }}>
                            <Skeleton variant="circular" width={64} height={64} />
                            <Skeleton variant="text" width={120} />
                        </Box>
                    ))
                ) : (
                    recipientList.map((recipient, index) => (
                        <Box
                            key={index}
                            sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                            <IconButton
                                onClick={() => navigate("/new-payment-portal", { state: { recipient } })}
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: "50%",
                                    backgroundColor: "#7256d6",
                                    color: "#fff",
                                    fontWeight: "italic",
                                    fontSize: "16px",
                                    "&:hover": {
                                        backgroundColor: "#6244d5"
                                    }
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {getInitials(recipient.fullName)}
                            </IconButton>

                            <Fade in={hoveredIndex === index}>
                                <Typography>{recipient.fullName}</Typography>
                            </Fade>
                        </Box>
                    ))
                )}

                <Box>
                    <IconButton
                        onClick={() => setOpenModal(true)}
                        sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            backgroundColor: "transparent",
                            border: "2px dashed #1976d2",
                            color: "#1976d2",
                            fontSize: "20px",
                            fontWeight: "bold"
                        }}
                    >
                        +
                    </IconButton>
                </Box>
            </Box>

            <AddFastPayment
                open={openModal}
                onClose={() => setOpenModal(false)}
                onAddRecipient={handleAddRecipient}
                recipient={recipient}
                setRecipient={setRecipient}
                error={error}
            />
        </Box>
    );
};

export default FastPayments;
