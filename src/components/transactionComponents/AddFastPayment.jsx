import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fetchAllRecipientsForUser, getUserIdFromToken } from "../../services/AxiosBanking";



const AddFastPayment = ({ open, onClose, onSelectRecipient }) => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    const loadRecipients = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;

      try {
        const data = await fetchAllRecipientsForUser(userId);
        setRecipients(data);
      } catch (err) {
        console.error("Failed to fetch recipients:", err);
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
          width: 500,
          padding: 4,
          margin: "auto",
          marginTop: "10%",
          backgroundColor: isDarkMode ? "#212128" : "#f0f0f0",
          borderRadius: 2,
          color: "white"
        }}
      >
        <Typography variant="h6" sx={{ mb: 2,  textAlign: "center" }}>
          {recipients.length === 0 ? "No saved recipients found." : "Select recipient:"}
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {recipients.map((recipient, index) => (
              <ListItem
                key={index}
                button
                onClick={() => {
                  onSelectRecipient(recipient);
                  onClose();
                }}
              >
                <ListItemText
                  primary={recipient.fullName}
                  secondary={`${recipient.accountNumber} | ${recipient.address}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default AddFastPayment;
