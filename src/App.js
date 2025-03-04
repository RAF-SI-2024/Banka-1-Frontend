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
import PasswordReset from './pages/loginPassword/PasswordReset';
import PasswordResetConfirmation from './pages/loginPassword/PasswordResetConfirmation';
import HomePage from './pages/common/HomePage';
import PasswordSetConfirmation from './pages/loginPassword/PasswordSetConfirmation';

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
            <Route path="/reset-password-email" element={<PasswordReset />} />
            <Route path="/reset-password" element={<PasswordResetConfirmation />} />
            <Route path="/set-password" element={<PasswordSetConfirmation />} />
          </Routes>
          <ThemeToggle />
        </BrowserRouter>
      </CardProvider>
    </ThemeProvider>
  );
}

export default App;
