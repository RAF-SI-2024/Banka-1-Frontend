import React, { useState } from "react";
import { useCards } from "../../context/CardContext";

import { Modal, Box, Typography, Button, TextField,  Link } from "@mui/material";
import ChangeCardNameModal from "./ChangeCardNameModal";
import ChangeCardLimitModal from "./ChangeCardLimitModal";
import { useNavigate } from "react-router-dom";

import "../../styles/CardModal.module.css"; 


const CardDetailsModal = ({ open, onClose, card }) => {
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const { updateStatus } = useCards();

  const navigate = useNavigate();


  if (!card) return null;

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box className="modal-container">
          <Typography variant="h6" className="modal-title">Card details</Typography>

          <div className="modal-content">
            <Typography className="modal-label">Card number</Typography>
            <TextField 
              className="modal-input"
              fullWidth
              disabled
            />

            <Typography className="modal-label">Card name</Typography>
            <TextField 
              className="modal-input"
              fullWidth
              disabled
            />

            <Typography className="modal-label">Account number</Typography>
            <TextField 
              className="modal-input"
              fullWidth
              disabled
            />

            <div className="modal-grid">
              <div className="modal-grid-item">
                <Typography className="modal-label">CVV</Typography>
                <TextField 
                  className="modal-input"
                  fullWidth
                  disabled
                />
              </div>
              <div className="modal-grid-item">
                <Typography className="modal-label">Card type</Typography>
                <TextField 
                  className="modal-input"
                  fullWidth
                  disabled
                />
              </div>
            </div>

            <div className="modal-grid">
              <div className="modal-grid-item">
                <Typography className="modal-label">Created on</Typography>
                <TextField 
                  className="modal-input"
                  fullWidth
                  disabled
                 
                />
              </div>
              <div className="modal-grid-item">
                <Typography className="modal-label">Valid through</Typography>
                <TextField 
                  className="modal-input"
                  fullWidth
                  disabled
                  
                />
              </div>
            </div>

            <div className="modal-grid">
              <div className="modal-grid-item">
                <Typography className="modal-label">Limit</Typography>
                <TextField 
                  className="modal-input"
                  fullWidth
                  disabled
                  
                />
              </div>
              <div className="modal-grid-item">
                <Typography className="modal-label">Status</Typography>
                <TextField 
                  className="modal-input"
                  fullWidth
                  disabled
                  
                />
              </div>
            </div>
          </div>

          <div className="modal-links">
            <Link onClick={() => setNameModalOpen(true)} className="modal-link">Change card name</Link>
            <Link onClick={() => setLimitModalOpen(true)} className="modal-link">Change card limit</Link>
          </div>

          <div className="modal-links">
            <Link className="modal-link" onClick={() => updateStatus(card.card_id, "blocked")}>
              Block card
            </Link>
            <Link className="modal-link" onClick={() => navigate("/pages/portal/NewPaymentPortal")}>
              New payment
            </Link>
          </div>



          <div className="modal-buttons">
            <Button className="modal-button" variant="contained" onClick={onClose}>Back</Button>
          </div>
        </Box>
      </Modal>

      <ChangeCardNameModal open={nameModalOpen} onClose={() => setNameModalOpen(false)} card={card} />
      <ChangeCardLimitModal open={limitModalOpen} onClose={() => setLimitModalOpen(false)} card={card} />
    </>
  );
};

export default CardDetailsModal;