import React, { useState } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { useCards } from "../../context/CardContext";

const ChangeCardLimitModal = ({ open, onClose, card }) => {
  const { updateCardLimit } = useCards();
  const [newLimit, setNewLimit] = useState("");

  const handleSave = async () => {
    if (!newLimit.trim()) return;
    await updateCardLimit(card.id, newLimit);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-container">
        <Typography variant="h6" className="modal-title">Change Card Limit</Typography>

        <Typography className="modal-label">Current Limit</Typography>
        <TextField fullWidth disabled value={card?.limit} />

        <Typography className="modal-label">New Limit</Typography>
        <TextField fullWidth value={newLimit} onChange={(e) => setNewLimit(e.target.value)} />

        <Box className="modal-buttons">
          <Button variant="contained" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChangeCardLimitModal;
