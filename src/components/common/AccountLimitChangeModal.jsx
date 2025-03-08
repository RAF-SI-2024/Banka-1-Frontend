import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { updateAccount } from "../../services/AxiosBanking"; // Pretpostavljamo da imate ovu funkciju

const AccountLimitChangeModal = ({ open, onClose, account, onSave }) => {
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    if (account) {
      setLimit(account.available || "");
      console.log(account);
    }
  }, [account]);

  const handleSave = async () => {

    const updatedAccount = {
      dailyLimit: limit,
      monthlyLimit: account.monthlyLimit,
    };

    /*
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long ownerID;

    @Column(nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private Double balance;

    @Column(nullable = false)
    private Double reservedBalance;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountType type;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CurrencyType currencyType;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountSubtype subtype;

    @Column(nullable = false)
    private Long createdDate;

    @Column(nullable = false)
    private Long expirationDate;

    @Column(nullable = false)
    private Double dailyLimit;

    @Column(nullable = false)
    private Double monthlyLimit;

    @Column(nullable = false)
    private Double dailySpent;

    @Column(nullable = false)
    private Double monthlySpent;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    @Column(nullable = false)
    private Long employeeID;

    @Column(nullable = false)
    private Double monthlyMaintenanceFee;
    */

    //api poziv
    try {
      const response = await updateAccount(account.id, account.ownerID, updatedAccount); 
      console.log("Account updated successfully:", response);
      onSave(updatedAccount); 
      window.location.reload()
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
              label="Current limit"
              value={account?.dailyLimit || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              type="number" // Obezbeđuje da korisnik unese broj
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

export default AccountLimitChangeModal;
