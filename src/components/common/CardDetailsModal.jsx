import React, { useState } from "react";

import { Modal, Box, Typography, Button, TextField,  Link, Grid, DialogActions } from "@mui/material";
import ChangeCardNameModal from "./ChangeCardNameModal";
import ChangeCardLimitModal from "./ChangeCardLimitModal";
import { useNavigate } from "react-router-dom";
import "../../styles/CardModal.module.css"; 
import { updateCardStatus } from "../../services/AxiosBanking";
import {toast} from "react-toastify";


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
               value = {card.cardName} />
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
              <Link
                  className="modal-link"
                  onClick={async () => {
                      try {
                          // You can handle the action of blocking/unblocking here
                          if (card.blocked) {
                              // Unblock the card
                              await updateCardStatus(card.id, false);
                              toast.success("Card successfully unblocked!")
                              // alert("Card successfully unblocked!");
                          } else {
                              // Block the card
                              await updateCardStatus(card.id, true);
                              toast.success("Card successfully blocked!")
                              // alert("Card successfully blocked!");
                          }
                          onClose();
                      } catch (error) {
                          toast.error(card.blocked ? "Failed to unblock card." : "Failed to block card.")
                          // alert(card.blocked ? "Failed to unblock card." : "Failed to block card.");
                          console.error("Error blocking/unblocking card:", error);
                      }
                  }}
              >
                  {card.blocked ? "Unblock card" : "Block card"}
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


const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid date';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export default CardDetailsModal;