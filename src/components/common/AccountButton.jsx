import React, { useState } from "react";
import { Button } from "@mui/material";
import AccountDetailsModal from "./AccountDetailsModal";

const AccountButton = ({ account }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
            textTransform: "none",
            color: "#1976D2",
            fontWeight: "normal",
            padding: 0,
            "&:hover": { 
              color: "#1565C0",
              textDecoration: "underline"
            },
          }}
      >
        Details
      </Button>

      {/* Modal sa podacima o racunu */}
      <AccountDetailsModal 
        open={open} 
        onClose={() => setOpen(false)} 
        account={account} 
      />
    </div>
  );
};

export default AccountButton;
