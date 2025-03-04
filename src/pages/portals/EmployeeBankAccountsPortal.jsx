import React, { useState } from 'react';
import { Typography } from '@mui/material';
import Sidebar from '../../components/mainComponents/Sidebar';
import SearchDataTable from '../../components/tables/SearchDataTable';
import AddButton from '../../components/common/AddButton';

const EmployeeBankAccountsPortal = () => {
  // Mock data - replace with actual data from your backend
  const accounts = [
    {
      id: 1,
      accountNumber: '123456789',
      firstName: 'John',
      lastName: 'Doe',
      accountType: 'Personal',
      currencyType: 'Current'
    },
    // Add more mock data as needed
  ];

  const columns = [
    { field: 'accountNumber', headerName: 'Account Number', width: 150 },
    { field: 'firstName', headerName: 'Owner First Name', width: 150 },
    { field: 'lastName', headerName: 'Owner Last Name', width: 150 },
    { field: 'accountType', headerName: 'Personal/Business', width: 150 },
    { field: 'currencyType', headerName: 'Current/Foreign', width: 150 },
  ];

  const handleAddClick = () => {
    // Implement add functionality
    console.log('Add button clicked');
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
          actionButton={<AddButton onClick={handleAddClick} label="Add" />}
        />
      </div>
    </div>
  );
};

export default EmployeeBankAccountsPortal; 