import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { updateAccount } from "../../services/AxiosBanking";

const AccountNameChangeModal = ({ open, onClose, account, onSave }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (account) {
      setName(account.name || "");
    }
  }, [account]);

  const handleSave = async () => {
    const updatedAccount = {
      ownerID: account.ownerID,
      currency: account.currency,
      type: account.type,
      subtype: account.subtype,
      dailyLimit: account.dailyLimit,
      monthlyLimit: account.monthlyLimit,
      status: account.status,
      name: name, // Novo ime računa
    };

    try {
      const response = await updateAccount(updatedAccount);
      console.log("Account updated successfully:", response);
      onSave(updatedAccount);
    } catch (err) {
      console.error("Failed to update account:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Account Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current account name"
              value={account?.name || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New account name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>BACK</Button>
        <Button onClick={handleSave} variant="contained">SAVE</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountNameChangeModal;
