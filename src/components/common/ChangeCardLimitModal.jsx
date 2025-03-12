import React, { useState } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { changeCardLimit } from "../../services/AxiosBanking";

const ChangeCardLimitModal = ({ open, onClose, card }) => {
  const [newLimit, setNewLimit] = useState("");

  const handleSave = async () => {
    if (!newLimit.trim()) return;
    await changeCardLimit(card.id, newLimit);
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
        <Typography variant="h6" className="modal-title">Change Card Limit</Typography>

        <Typography className="modal-label">Current Limit</Typography>
        <TextField 
          fullWidth disabled 
          value={card?.cardLimit} 
        />
        <Typography className="modal-label">New Limit</Typography>
        <TextField fullWidth value={newLimit} onChange={(e) => setNewLimit(e.target.value)} />

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

export default ChangeCardLimitModal;
