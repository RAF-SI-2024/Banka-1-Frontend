import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Link,
} from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import AccountNameChangeModal from "./AccountNameChangeModal";
import AccountLimitChangeModal from "./AccountLimitChangeModal";

const AccountDetailsModal = ({ open, onClose, account }) => {
  const { mode } = useTheme();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Detalji računa
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Account name" value={account?.id || ""} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Account number" value={account?.accountNumber || ""} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Account owner" value={account?.ownerID || ""} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Type" value={account?.type || ""} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Available" value={`${account?.dailyLimit} RSD`} disabled />   {/*Da li ovde treba dailyLimit? */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Reserved" value={`${account?.dailySpent} RSD`} disabled />   {/*Da li ovde treba dailySpent? */}
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Balance" value={`${account?.balance} RSD`} disabled />
          </Grid>
        </Grid>
        {/* Linkovi za otvaranje modala */}
        <Grid container spacing={2} mt={3}>
          <Grid item xs={6}>
            <Link href="#" onClick={() => setIsNameModalOpen(true)} sx={{ color: "#FDD835", textDecoration: "none", fontSize: "0.9rem", "&:hover": { textDecoration: "underline" } }}>Name change</Link>
            <br />
            <Link href="#" onClick={() => setIsLimitModalOpen(true)} sx={{ color: "#FDD835", textDecoration: "none", fontSize: "0.9rem", "&:hover": { textDecoration: "underline" } }}>Limit Change</Link>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Link href="#" sx={{ color: "#FDD835", textDecoration: "none", fontSize: "0.9rem", "&:hover": { textDecoration: "underline" } }}>New payment</Link>
            <br />
            <Link href="#" sx={{ color: "#FDD835", textDecoration: "none", fontSize: "0.9rem", "&:hover": { textDecoration: "underline" } }}>New card</Link>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: "#FDD835", color: "#000", fontWeight: "bold" }}>
          BACK
        </Button>
      </DialogActions>

      {/* Modali za promenu naziva i limita */}
      <AccountNameChangeModal
        open={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        account={account}
        onSave={(updatedAccount) => {
          console.log("Sačuvan novi naziv računa:", updatedAccount);
          setIsNameModalOpen(false);
        }}
      />
      
      <AccountLimitChangeModal
        open={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        account={account}
        onSave={(updatedAccount) => {
          console.log("Sačuvan novi limit:", updatedAccount);
          setIsLimitModalOpen(false);
        }}
      />
    </Dialog>
  );
};

export default AccountDetailsModal;
