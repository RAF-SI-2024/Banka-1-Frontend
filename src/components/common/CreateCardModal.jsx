import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useCards } from "../../context/CardContext";
import { fetchCustomerById } from "../../services/AxiosUser.js";

const CreateCardModal = ({ open, onClose, accountId }) => {
  const { addCard } = useCards();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available accounts when modal opens
  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      try {
        const data = await fetchCustomerById(accountId); 
        setAccounts(data.accounts || []);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
      setLoading(false);
    };

    if (open) loadAccounts();
  }, [open, accountId]);

  const handleCreateCard = async () => {
    if (!selectedAccount) return;

    try {
      await addCard(selectedAccount, "debit"); 
      onClose();
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "#1c1f2b",
          color: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
          Create new card
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }} disabled={loading || accounts.length === 0}>
          <InputLabel>Select account</InputLabel>
          <Select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            displayEmpty
          >
            {accounts.length > 0 ? (
              accounts.map((acc) => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.account_type.toUpperCase()} - {acc.currency}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No accounts available</MenuItem>
            )}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleCreateCard} disabled={!selectedAccount}>
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateCardModal;
