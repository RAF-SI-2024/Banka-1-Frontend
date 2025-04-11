import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fetchAllRecipientsForUser, getUserIdFromToken } from "../../services/AxiosBanking";

const FastPaymentPopup = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    accountNumber: ""
  });

  const [error, setError] = useState("");
  const [recipients, setRecipients] = useState([]);
  
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const { name, address, accountNumber } = form;
    if (!name.trim() || !address.trim() || !accountNumber.trim()) {
      setError("All fields are required.");
      return;
    }

    setError("");
    onSave(form);
    setForm({ name: "", address: "", accountNumber: "" });
    onClose();
  };

  useEffect(() => {
    const loadRecipients = async () => {
      try {
        const userId = getUserIdFromToken();
        const data = await fetchAllRecipientsForUser(userId);
        setRecipients(data || []);
      } catch (err) {
        console.error("Failed to load recipients", err);
        setRecipients([]);
      }
    };

    if (open) {
      loadRecipients();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 450,
          backgroundColor: isDarkMode ? "#212128" : "#f0f0f0",
          color: "#fff",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          mx: "auto",
          mt: "5%"
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add fast payment recipient
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            label="Account Number"
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={onClose} sx={{ mr: 2 }} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Stack>

        {/* <Divider sx={{ my: 3, bgcolor: "#444" }} />

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {recipients.length === 0 ? "No saved recipients." : "Saved Recipients"}
        </Typography>

        <Box sx={{ maxHeight: 180, overflowY: "auto" }}>
          {recipients.map((r, idx) => (
            <Box
              key={idx}
              sx={{
                bgcolor: "#2a2a3a",
                p: 2,
                mb: 1,
                borderRadius: 1,
                border: "1px solid #444"
              }}
            >
              <Typography variant="body1">{r.fullName}</Typography>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                {r.accountNumber} | {r.address}
              </Typography>
            </Box>
          ))}
        </Box> */}
      </Box>
    </Modal>
  );
};

export default FastPaymentPopup;
