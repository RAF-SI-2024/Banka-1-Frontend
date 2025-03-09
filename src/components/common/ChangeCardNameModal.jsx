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
       <Box
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 800,
                bgcolor: "#1c1f2b",
                color: "white",
                p: 4,
                borderRadius: 2,
                boxShadow: 24,
            }}
        >
        <Typography variant="h6" className="modal-title">Change Card Name</Typography>

        <Typography className="modal-label">Current Name</Typography>
        <TextField 
          fullWidth disabled 
          value={card.cardBrand} />

        <Typography className="modal-label">New Name</Typography>
        <TextField fullWidth value={newName} onChange={(e) => setNewName(e.target.value)} />

        <Box className="modal-buttons" sx={{marginTop: 2}}>
          <Button variant="contained" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave} sx={{marginLeft: 2}}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChangeCardNameModal;

