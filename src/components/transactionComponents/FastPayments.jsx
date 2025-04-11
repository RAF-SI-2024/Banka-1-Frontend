import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Tooltip, Skeleton, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  createRecipientt,
  fetchRecipientsForFast,
  fetchAllRecipientsForUser,
  getUserIdFromToken
} from "../../services/AxiosBanking";
import FastPaymentPopup from "./FastPaymentPopup";

const FastPayments = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [recipientList, setRecipientList] = useState([]);
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
          console.error("Failed to load recipients.");
        } finally {
          setLoading(false);
        }
      };
      fetchTopRecipients();
    } else {
      setLoading(false);
    }
  }, []);

  const getInitials = (fullName) => {
    const parts = fullName?.trim()?.split(" ");
    const first = parts?.[0]?.charAt(0)?.toUpperCase() || "";
    const last = parts?.[1]?.charAt(0)?.toUpperCase() || "";
    return first + last;
  };

  return (
    <Box
      sx={{
        width: "max-content",
        borderRadius: 4,
        padding: 3,
        paddingLeft: "50px",
        bgcolor: "transparent",
        backdropFilter: "none",
        textAlign: "left",
        mb: 4
      }}
    >
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
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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

      <FastPaymentPopup
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={() => {
          const userId = getUserIdFromToken();
          if (userId) {
            fetchRecipientsForFast(userId).then(setRecipientList);
          }
        }}
      />
    </Box>
  );
};

export default FastPayments;
