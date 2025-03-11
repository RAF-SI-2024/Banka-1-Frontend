import React, { useState } from "react";

import { Modal, Box, Typography, Button, TextField,  Link, Grid, DialogActions } from "@mui/material";
import ChangeCardNameModal from "./ChangeCardNameModal";
import ChangeCardLimitModal from "./ChangeCardLimitModal";
import { useNavigate } from "react-router-dom";
import "../../styles/CardModal.module.css"; 
import { updateCardStatus } from "../../services/AxiosBanking";


const CardDetailsModal = ({ open, onClose, card }) => {
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  const navigate = useNavigate();


  if (!card) return null;
  console.log("Card", card);

  return (
    <>
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" className="modal-title">Card details</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography className="modal-label">Card number</Typography>
              <TextField className="modal-input"
               fullWidth disabled
               value = {card.cardNumber} />
            </Grid>

            <Grid item xs={12}>
              <Typography className="modal-label">Card name</Typography>
              <TextField className="modal-input"
               fullWidth disabled
               value = {card.cardBrand} />
            </Grid>

            <Grid item xs={12}>
              <Typography className="modal-label">Account number</Typography>
              <TextField className="modal-input"
               fullWidth disabled
               value = {card.account.accountNumber} />
            </Grid>

            <Grid item xs={6}>
              <Typography className="modal-label">CVV</Typography>
              <TextField className="modal-input"
               fullWidth disabled
               value = {card.cardCvv} />
            </Grid>

            <Grid item xs={6}>
              <Typography className="modal-label">Card type</Typography>
              <TextField className="modal-input"
               fullWidth disabled
               value = {card.cardType} />
            </Grid>

            <Grid item xs={6}>
              <Typography className="modal-label">Created on</Typography>
              <TextField className="modal-input"
               fullWidth disabled
               value = {formatDate(card.createdAt)} />
            </Grid>

            <Grid item xs={6}>
              <Typography className="modal-label">Valid through</Typography>
              <TextField className="modal-input"
               fullWidth disabled
               value = {formatDate(card.expirationDate)} />
            </Grid>

            <Grid item xs={6}>
              <Typography className="modal-label">Limit</Typography>
              <TextField className="modal-input"
               fullWidth disabled
               value = {card.cardLimit} />
            </Grid>

            <Grid item xs={6}>
              <Typography className="modal-label">Status</Typography>
              <TextField className="modal-input"
               fullWidth disabled
               value={card.active ? "Active" : "Disabled"} />
            </Grid>
          </Grid>

          <DialogActions sx={{justifyContent: "center", alignItems: "center"}}>
            <Link  onClick={() => setNameModalOpen(true)} className="modal-link">Change card name</Link>
            <Link sx={{ml:10}} onClick={() => setLimitModalOpen(true)} className="modal-link">Change card limit</Link>
          </DialogActions>

          <DialogActions sx={{justifyContent: "center", alignItems: "center"}}>
            <Link className="modal-link" onClick={() => updateCardStatus(card.id, "BLOCKED")}>
              Block card
            </Link>
            <Link className="modal-link" onClick={() => navigate("/new-payment-portal")}>
              New payment
            </Link>
          </DialogActions>



          <DialogActions sx={{ justifyContent: "center" , alignItems: "center"}}>
              <Button className="modal-button" variant="contained" onClick={onClose}>Back</Button>
          </DialogActions>
        </Box>
      </Modal>

      <ChangeCardNameModal  open={nameModalOpen} onClose={() => setNameModalOpen(false)} card={card} />
      <ChangeCardLimitModal  open={limitModalOpen} onClose={() => setLimitModalOpen(false)} card={card} />
    </>
  );
};


function formatDate(timestamp){
  return new Date(timestamp * 1000).toLocaleDateString();
}
export default CardDetailsModal;