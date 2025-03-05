import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/loginPassword/Login';
import Landing from './pages/common/Landing';  
import { ThemeProvider } from './context/ThemeContext';
import { CardProvider } from './context/CardContext';  // Imporovan glavni context za kartice
import CardsPage  from './pages/portals/CardsPortal'; // Importovana stranica za kartice
import ThemeToggle from './components/mainComponents/ThemeToggle';
import CustomerPortal from './pages/portals/CustomerPortal';
import EmployeePortal from './pages/portals/EmployeePortal';
import EmployeeBankAccountsPortal from './pages/portals/EmployeeBankAccountsPortal';
import EmployeeCardsPortal from './pages/portals/EmployeeCardsPortal';
import PasswordReset from './pages/loginPassword/PasswordReset';
import PasswordResetConfirmation from './pages/loginPassword/PasswordResetConfirmation';
import HomePage from './pages/common/HomePage';
import PasswordSetConfirmation from './pages/loginPassword/PasswordSetConfirmation';
import NewPaymentPortal from "./pages/portals/NewPaymentPortal";
import AccountsPortal from './pages/portals/AccountsPortal';
import ReceiversPortal from "./pages/portals/ReceiversPortal";
import TransactionsPage from './pages/transactions/TransactionsPage';
import TransactionDetailsPage from './pages/transactions/TransactionDetailsPage';
import InternalTransferPortal from './pages/portals/InternalTransferPortal';

function App() {
  return (
    <ThemeProvider>
      <CardProvider>  {/* Dodala globalni CardProvider */}
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/cards" element={<CardsPage/>} />
            <Route path="/customer-portal" element={<CustomerPortal />} />
            <Route path="/employee-portal" element={<EmployeePortal />} />
            <Route path="/employee-bank-accounts-portal" element={<EmployeeBankAccountsPortal />} />
            <Route path="/employee-cards-portal" element={<EmployeeCardsPortal />} />
            <Route path="/reset-password-email" element={<PasswordReset />} />
            <Route path="/reset-password" element={<PasswordResetConfirmation />} />
            <Route path="/set-password" element={<PasswordSetConfirmation />} />
            <Route path="/receivers" element={<ReceiversPortal />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transactions/:id" element={<TransactionDetailsPage />} />
            <Route path="/internal-transfer-portal" element={< InternalTransferPortal />} />  
            <Route path="/new-payment-portal" element={<NewPaymentPortal />} />
          </Routes>
          <ThemeToggle />
        </BrowserRouter>
      </CardProvider>
    </ThemeProvider>
  );
}

export default App;
