import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { fetchAllRecipientsForUser, getUserIdFromToken } from "../../services/AxiosBanking";

const FastPaymentPopup = ({ open, onClose, onSelect }) => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipients = async () => {
      try {
        const userId = getUserIdFromToken();
        const data = await fetchAllRecipientsForUser(userId);
        setRecipients(data);
      } catch (error) {
        console.error("Error loading recipients:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      setLoading(true);
      loadRecipients();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          margin: "auto",
          mt: "15%",
          bgcolor: "#fff",
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Select Fast Payment Recipient
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {recipients.map((r, idx) => (
              <ListItem
                key={idx}
                button
                onClick={() => {
                  onSelect(r);
                  onClose();
                }}
              >
                <ListItemText
                  primary={r.fullName}
                  secondary={`${r.accountNumber} | ${r.address}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default FastPaymentPopup;
