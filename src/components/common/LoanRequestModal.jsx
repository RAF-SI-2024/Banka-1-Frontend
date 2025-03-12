import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import { fetchAccountsForUser, submitLoanRequest } from "../../services/AxiosBanking";

const LoanRequestModal = ({ open, onClose }) => {
  const [loanType, setLoanType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanReason, setLoanReason] = useState("");
  const [currencyType, setCurrencyType] = useState("");
  const [numberOfInstallments, setNumberOfInstallments] = useState("");
  const [nominalRate, setNominalRate] = useState("");
  const [effectiveRate, setEffectiveRate] = useState("");
  const [interestType, setInterestType] = useState("FIXED");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [loading, setLoading] = useState(false);

  //dobavljanje racuna
  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const userAccounts = await fetchAccountsForUser();
        setAccounts(userAccounts);
      } catch (error) {
        console.error("Error fetching user accounts:", error);
      }
    };

    if (open) fetchUserAccounts();
  }, [open]);

 //automatski postavlja polje valute na onu valutu koja je na racunu 
  const handleAccountChange = (e) => {
    const accountId = e.target.value;
    const selectedAcc = accounts.find(acc => acc.id === accountId);
    
    if (selectedAcc) {
      setSelectedAccount(accountId);
      setCurrencyType(selectedAcc.currencyType);
    }
  };

  const installmentOptions = {
    CASH: [12, 24, 36, 48, 60, 72, 84],
    AUTO: [12, 24, 36, 48, 60, 72, 84],
    STUDENT: [12, 24, 36, 48, 60, 72, 84],
    REFINANCING: [12, 24, 36, 48, 60, 72, 84],
    MORTGAGE: [60, 120, 180, 240, 300, 360]
  };

  const handleSubmit = async () => {
    if (!selectedAccount) {
      alert("You must select an account before submitting the request.");
      return;
    }

    // if (!loanType || !loanAmount || !currencyType) {
    //   alert("Please fill in all required fields.");
    //   return;
    // } // nije definisano po spec, samo racun je obavezan

    const requestData = {
      loanReason,
      loanType,
      numberOfInstallments: Number(numberOfInstallments) || 0, 
      interestType,
      nominalRate: Number(nominalRate) || 0, 
      effectiveRate: Number(effectiveRate) || 0, 
      loanAmount: Number(loanAmount) || 0, 
      duration: 0,
      allowedDate: 0,
      monthlyPayment: 0,
      currencyType,
      accountId: selectedAccount
    };

    console.log("Submitting loan request:", requestData); 

    try {
      setLoading(true);
      await submitLoanRequest(requestData);
      alert("Loan request submitted successfully!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting loan request:", error);
      console.log("Backend response:", error.response?.data); 
      alert("Failed to submit loan request. Please try again.");
    }
    setLoading(false);
};

  const resetForm = () => {
    setLoanType("");
    setLoanAmount("");
    setLoanReason("");
    setCurrencyType("");
    setNumberOfInstallments("");
    setNominalRate("");
    setEffectiveRate("");
    setInterestType("FIXED");
    setSelectedAccount("");
  };

  return (
    <Modal open={open} onClose={() => { resetForm(); onClose(); }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "#1c1f2b",
          color: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 24
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
          New Loan Request 
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }} error={!selectedAccount}>
          <InputLabel>Select account</InputLabel>
          <Select value={selectedAccount} onChange={handleAccountChange}>
            {accounts.map((acc) => (
              <MenuItem key={acc.id} value={acc.id}>
                {acc.accountNumber} ({acc.currencyType})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Currency"
          value={currencyType}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Loan type</InputLabel>
          <Select value={loanType} onChange={(e) => setLoanType(e.target.value)}>
            <MenuItem value="CASH">Cash</MenuItem>
            <MenuItem value="MORTGAGE">Mortgage</MenuItem>
            <MenuItem value="AUTO">Auto</MenuItem>
            <MenuItem value="REFINANCING">Refinancing</MenuItem>
            <MenuItem value="STUDENT">Student</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Loan amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Loan reason"
          value={loanReason}
          onChange={(e) => setLoanReason(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Number of installments</InputLabel>
          <Select
            value={numberOfInstallments}
            onChange={(e) => setNumberOfInstallments(e.target.value)}
          >
            {installmentOptions[loanType]?.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Interest type</InputLabel>
          <Select value={interestType} onChange={(e) => setInterestType(e.target.value)}>
            <MenuItem value="FIXED">Fixed</MenuItem>
            <MenuItem value="VARIABLE">Variable</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Nominal rate"
          value={nominalRate}
          onChange={(e) => setNominalRate(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Effective rate"
          value={effectiveRate}
          onChange={(e) => setEffectiveRate(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="error" onClick={() => { resetForm(); onClose(); }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!selectedAccount || loading}
          >
            {loading ? "Submitting..." : "Submit loan request"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoanRequestModal;


//Kod za dodavanje dugmeta koje otvara modal - dodati na pocetnu stranicu za kredite

//import LoanRequestModal from "../../components/common/LoanRequestModal"; // 


 // const [setLoanModalOpen] = useState(false);

            // <Button 
            //   variant="contained"     
            //   color="primary"          
            //   onClick={() => setLoanModalOpen(true)}  
            // >
            //   Apply for loan
            // </Button>

// {/* Dodajemo modal za kredit */}
//     <LoanRequestModal open={loanModalOpen} onClose={() => setLoanModalOpen(false)} />