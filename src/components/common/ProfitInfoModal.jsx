import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
//import { fetchUserProfit } from "../../services/AxiosTrading";

const ProfitInfoModal = ({ open, onClose, portfolioData }) => {
  const [profit, setProfit] = useState(null);


  useEffect(() => {
    if (portfolioData && Array.isArray(portfolioData)) {
      const totalProfit = portfolioData.reduce((acc, security) => acc + security.profit, 0);
      console.log(totalProfit);
      setProfit(totalProfit);
    } else {
      console.error("portfolioData is invalid or null");
      setProfit(0);
    }
  }, [portfolioData]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Profit Details</DialogTitle>
      <DialogContent>
        {profit !== null ? (
          <Typography
            variant="h5"
            sx={{
              color: profit >= 0 ? "green" : "red",
              textAlign: "center",
              mt: 2,
            }}
          >
            {profit.toFixed(2)} USD
          </Typography>
        ) : (
          <Typography variant="body1" textAlign="center">Loading...</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>BACK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfitInfoModal;
