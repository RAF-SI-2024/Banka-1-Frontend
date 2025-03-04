import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/loginPassword/Login';
import Landing from './pages/common/Landing';  
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/mainComponents/ThemeToggle';
import CustomerPortal from './pages/portals/CustomerPortal';
import EmployeePortal from './pages/portals/EmployeePortal';
import EmployeeBankAccountsPortal from './pages/portals/EmployeeBankAccountsPortal';
import EmployeeCardsPortal from './pages/portals/EmployeeCardsPortal';
import PasswordReset from './pages/loginPassword/PasswordReset';
import PasswordResetConfirmation from './pages/loginPassword/PasswordResetConfirmation';
import HomePage from './pages/common/HomePage';
import PasswordSetConfirmation from './pages/loginPassword/PasswordSetConfirmation';
import InternalTransferPortal from './pages/portals/InternalTransferPortal';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/** Define the routes for the application */}
          <Route path="/" element={<Landing />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/customer-portal" element={<CustomerPortal />} />
          <Route path="/employee-portal" element={<EmployeePortal />} />
          <Route path="/employee-bank-accounts-portal" element={<EmployeeBankAccountsPortal />} />
          <Route path="/employee-cards-portal" element={<EmployeeCardsPortal />} />
          <Route path="/reset-password-email" element={<PasswordReset />} />
          <Route path="/reset-password" element={<PasswordResetConfirmation />} />
          <Route path="/set-password" element={<PasswordSetConfirmation />} />
          <Route path="/internal-transfer-portal" element={< InternalTransferPortal />} />
        </Routes>
        <ThemeToggle />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;