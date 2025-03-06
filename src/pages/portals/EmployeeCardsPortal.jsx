import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper,
  Grid,
  Button,
  Box
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/mainComponents/Sidebar';
import DataTable from '../../components/tables/DataTable';
import { fetchCardsByAccountId } from '../../services/AxiosBanking';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EmployeeCardsPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedAccount = location.state?.selectedAccount;
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { field: 'cardNumber', headerName: 'Card Number', width: 200 },
    { field: 'firstName', headerName: 'Owner First Name', width: 150 },
    { field: 'lastName', headerName: 'Owner Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'status', headerName: 'Card Status', width: 120 },
  ];

  useEffect(() => {
    if (!selectedAccount) {
      setError('No account selected. Please select an account from the accounts list.');
      setLoading(false);
      return;
    }
    loadCards();
  }, [selectedAccount]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const response = await fetchCardsByAccountId(selectedAccount.id);
      setCards(response);
    } catch (err) {
      console.error('Error loading cards:', err);
      setError('Failed to load cards data');
      toast.error('Failed to load cards data');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/employee-bank-accounts-portal');
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
            {/* Account Information Section */}
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
              </Grid>
            </Paper>
            
            {/* Cards Table Section */}
            <Typography variant="h6" gutterBottom>
              Cards for Account
            </Typography>
            <DataTable
              rows={cards}
              columns={columns}
              checkboxSelection={false}
              hideSearch={true}
              hideActionButton={true}
              loading={loading}
              error={error}
            />
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