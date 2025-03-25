import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  Select,
  MenuItem
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/mainComponents/Sidebar';
import {
  blockCard,
  changingAccountStatus,
  deactivateCard,
  fetchCardsByAccountId
} from '../../services/AxiosBanking';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardDisplay from "../../components/common/CreditCardDisplay";

const EmployeeCardsPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedAccount = location.state?.selectedAccount;
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBlock = async (row) => {
    try {
      const employeeData = {
        ...row.originalData,
        blocked: !row.blocked
      };

      await blockCard(row.id, employeeData.blocked);
      setCards(prevRows =>
          prevRows.map(r =>
              r.id === row.id ? { ...r, blocked: !r.blocked } : r
          )
      );
      toast.success(`Blocked successfully`);
    } catch (error) {
      console.error("Error updating employee status:", error);
      toast.error(`Failed to update employee status: ${error.message}`);
    }
  };

  const handleActive = async (row) => {
    if (!row.active) {
      toast.error("This card is permanently deactivated and cannot be reactivated.");
      return;
    }

    try {
      const newStatus = !row.active;

      await deactivateCard(row.id, newStatus);

      setCards((prev) =>
          prev.map((r) =>
              r.id === row.id ? { ...r, active: newStatus } : r
          )
      );

      toast.success("Card deactivated successfully");
    } catch (error) {
      console.error("Error updating card status:", error);
      toast.error(`Failed to update card status: ${error.response?.data?.error || error.message}`);
    }
  };

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCardsByAccountId(selectedAccount.id);
      const rowData = data.data.cards;

      const formattedRows = rowData.map((row) => ({
        id: row.id,
        cardNumber: maskCardNumber(row.cardNumber),
        firstName: selectedAccount.firstName,
        lastName: selectedAccount.lastName,
        active: row.active,
        cardLimit: row.cardLimit,
        blocked: row.blocked,
        originalData: row
      }));

      setCards(formattedRows);
    } catch (err) {
      console.error('Error loading cards:', err);
      setError('Failed to load cards data');
      toast.error('Failed to load cards data');
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (!selectedAccount) {
      setError('No account selected. Please select an account from the accounts list.');
      setLoading(false);
      return;
    }
    loadCards();
  }, [selectedAccount, loadCards]);

  function maskCardNumber(cardNumber) {
    return cardNumber.replace(/^(\d{4})\d{8}(\d{4})$/, '$1********$2');
  }

  const handleBack = () => {
    navigate('/employee-bank-accounts-portal');
  };

  const handleStatusChange = async (status) => {
    try {
      await changingAccountStatus(selectedAccount.id, status);
      toast.success('Account status updated successfully.');
      navigate('/employee-bank-accounts-portal');
    } catch {
      toast.error('Account status failed.');
    }
  };

  return (
      <div>
        <Sidebar />
        <div style={{ padding: '20px', marginTop: '64px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ mr: 2 }}
            >
              Back to Accounts
            </Button>
          </Box>
          <Typography variant="h4" component="h1">
            Account information
          </Typography>

          {selectedAccount ? (
              <>
                <Paper
                    sx={{
                      p: 3,
                      mb: 4,
                      backgroundColor: 'rgba(25,25,25,0.01)',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      mt: 2,
                    }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" color="text.secondary">Account Number</Typography>
                      <Typography variant="body1" color="text.primary">{selectedAccount.accountNumber}</Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" color="text.secondary">Owner First Name</Typography>
                      <Typography variant="body1" color="text.primary">{selectedAccount.firstName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" color="text.secondary">Owner Last Name</Typography>
                      <Typography variant="body1" color="text.primary">{selectedAccount.lastName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" color="text.secondary">Account Type</Typography>
                      <Typography variant="body1" color="text.primary">{selectedAccount.accountType}</Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" color="text.secondary">Currency Type</Typography>
                      <Typography variant="body1" color="text.primary">{selectedAccount.currencyType}</Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                      <Select
                          value={selectedAccount.status}
                          onChange={(event) => handleStatusChange(event.target.value)}
                      >
                        <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                        <MenuItem value="BLOCKED">BLOCKED</MenuItem>
                        <MenuItem value="CLOSED">CLOSED</MenuItem>
                        <MenuItem value="FROZEN">FROZEN</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Paper>

                <Typography variant="h6" gutterBottom>
                  Cards for Account
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  {cards.map((card) => (
                      <Grid item key={card.id}>
                        <CreditCardDisplay
                            card={card}
                            onBlockToggle={handleBlock}
                            onActiveToggle={handleActive}
                        />
                      </Grid>
                  ))}
                </Grid>
              </>
          ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                  No Account Selected
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Please select an account from the accounts list to view its cards.
                </Typography>
              </Paper>
          )}
        </div>
      </div>
  );
};

export default EmployeeCardsPortal;