import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/mainComponents/Sidebar';
import SearchDataTable from '../../components/tables/SearchDataTable';
import AddButton from '../../components/common/AddButton';
import { fetchAccounts } from '../../services/Axios';
import { toast } from 'react-toastify';
import NewAccountModal from "../../components/common/NewAccountModal";
import NewCurrentAccountModal from "../../components/common/NewCurrentAccountModal";


const EmployeeBankAccountsPortal = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openCurrentModal, setOpenCurrentModal] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState(''); 


  const columns = [
    { field: 'accountNumber', headerName: 'Account Number', width: 150 },
    { field: 'firstName', headerName: 'Owner First Name', width: 150 },
    { field: 'lastName', headerName: 'Owner Last Name', width: 150 },
    { field: 'accountType', headerName: 'Personal/Business', width: 150 },
    { field: 'currencyType', headerName: 'Current/Foreign', width: 150 },
  ];

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetchAccounts();
      setAccounts(response);
    } catch (err) {
      console.error('Error loading accounts:', err);
      setError('Failed to load accounts data');
      toast.error('Failed to load accounts data');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row) => {
    navigate('/employee-cards-portal', { state: { selectedAccount: row } });
  };

  const handleContinue = (account, accountType) => {
    console.log("Selected Account:", account, "Account Type:", accountType);

    if (account === "current") {
      setSelectedAccountType(accountType);
      setOpenModal(false);
      setOpenCurrentModal(true);
    } else {
      console.log("Foreign currency account selected:", accountType);
      setOpenModal(false);
    }
  };


  return (
    <div>
      <Sidebar />
      <div style={{ padding: '20px', marginTop: '64px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bank Accounts Management
        </Typography>

        <SearchDataTable
          rows={accounts}
          columns={columns}
          checkboxSelection={false}
          actionButton={<AddButton onClick={() => setOpenModal(true)} label="Add" />}
          loading={loading}
          error={error}
          onRowClick={handleRowClick}
        />

        <NewAccountModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onContinue={(account, accountType) => {
              handleContinue(account, accountType)
            }}
        />
        <NewCurrentAccountModal
            open={openCurrentModal}
            onClose={() => setOpenCurrentModal(false)}
            accountType={selectedAccountType}
        />
      </div>
    </div>
  );
};

export default EmployeeBankAccountsPortal;