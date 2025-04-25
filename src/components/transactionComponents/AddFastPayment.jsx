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
import {
  fetchAllRecipientsForUser,
  getUserIdFromToken
} from "../../services/AxiosBanking";

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
        setRecipients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch recipients:", err);
        setRecipients([]);
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
          color: isDarkMode ? "white" : "black",
          maxHeight: "80vh",
          overflowY: "auto"
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          {recipients.length === 0 ? "No saved recipients found." : "Select recipient:"}
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {recipients.map((recipient, index) => {
              const fullName = recipient.fullName || "";
              const parts = fullName.trim().split(" ");
              const firstName = parts[0] || "";
              const lastName = parts.slice(1).join(" ") || "";

              return (
                <ListItem
                  key={recipient.id || index}
                  button
                  onClick={() => {
                    onSelectRecipient({
                      ...recipient,
                      firstName: recipient.firstName || fullName.split(" ")[0] || "",
                      lastName: recipient.lastName || fullName.split(" ").slice(1).join(" ") || ""
                    });
                    
                    onClose();
                  }}
                >
                 <ListItemText
                    primary={`${recipient.firstName || ""} ${recipient.lastName || ""}`.trim() || "Unnamed"}
                    secondary={`${recipient.accountNumber || "N/A"} | ${recipient.address || "No address"}`}
                  />

                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default AddFastPayment;
