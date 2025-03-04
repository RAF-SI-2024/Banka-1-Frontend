import React, { useState } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { useCards } from "../../context/CardContext";

const ChangeCardNameModal = ({ open, onClose, card }) => {
  const { updateCardName } = useCards();
  const [newName, setNewName] = useState("");

  const handleSave = async () => {
    if (!newName.trim()) return;
    await updateCardName(card.id, newName);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-container">
        <Typography variant="h6" className="modal-title">Change Card Name</Typography>

        <Typography className="modal-label">Current Name</Typography>
        <TextField fullWidth disabled value={card?.name} />

        <Typography className="modal-label">New Name</Typography>
        <TextField fullWidth value={newName} onChange={(e) => setNewName(e.target.value)} />

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

export default ChangeCardNameModal;

