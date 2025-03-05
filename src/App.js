
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./pages/loginPassword/Login";
import Landing from "./pages/common/Landing";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/mainComponents/ThemeToggle";
import CustomerPortal from "./pages/portals/CustomerPortal";
import EmployeePortal from "./pages/portals/EmployeePortal";
import PasswordReset from "./pages/loginPassword/PasswordReset";
import PasswordResetConfirmation from "./pages/loginPassword/PasswordResetConfirmation";
import HomePage from "./pages/common/HomePage";
import PasswordSetConfirmation from "./pages/loginPassword/PasswordSetConfirmation";
import AuthGuard from "./context/AuthGuard";

/*

TREBA DA SE ODKOMENTARISE KADA SE MERGUJE

import ClientAccountPortal from "./pages/portals/ClientAccountPortal";
import AccountsPortal from "./pages/portals/AccountsPortal";
import NewPaymentPortal from "./pages/portal/NewPaymentPortal";
import InternalTransferPortal from "./pages/portals/InternalTransferPortal";
import ReceiverPortal from "./pages/portals/ReceiverPortal";
import TransactionsPage from "./pages/transactions/TransactionsPage";
import CardsPortal from "./pages/portals/CardsPortal";
import EmployeeBankAccountsPortal from "./pages/portals/EmployeeBankAccountsPortal";
*/

function App() {
  return (
      <ThemeProvider>
        <CssBaseline />
        <BrowserRouter>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/reset-password-email" element={<PasswordReset />} />
            <Route path="/reset-password" element={<PasswordResetConfirmation />} />
            <Route path="/set-password" element={<PasswordSetConfirmation />} />

              {/* Protected Routes - Only Employees (Admin or Not) */}
            <Route
                path="/customer-portal"
                element={
                  <AuthGuard allowedPositions={["Radnik", "Menadžer", "Direktor", "HR", "Admin"]}>
                    <CustomerPortal />
                  </AuthGuard>
                }
            />
            <Route
                path="/employee-portal"
                element={
                  <AuthGuard allowedPositions={["Radnik", "Menadžer", "Direktor", "HR", "Admin"]}>
                      {<EmployeePortal />}
                  </AuthGuard>
                }
            />
              <Route
                  path="/employee-bank-accounts-portal"
                  element={
                      <AuthGuard allowedPositions={["Radnik", "Menadžer", "Direktor", "HR", "Admin"]}>
                          {/* <EmployeeBankAccountsPortal /> ODKOMENTARISATI */}
                      </AuthGuard>
                  }
              />


              {/* Protected Routes - Only Customers */}
              <Route
                  path="/home-portal"
                  element={
                      <AuthGuard allowedPositions={["Nijedna"]}>
                          {/* <ClientAccountPortal /> ODKOMENTARISATI */}
                      </AuthGuard>
                  }
              />
              <Route
                  path="/accounts-portal"
                  element={
                      <AuthGuard allowedPositions={["Nijedna"]}>
                          {/* <AccountsPortal /> ODKOMENTARISATI */}
                      </AuthGuard>
                  }
              />
              <Route
                  path="/new-payment-portal"
                  element={
                      <AuthGuard allowedPositions={["Nijedna"]}>
                          {/* <NewPaymentPortal /> ODKOMENTARISATI */}
                      </AuthGuard>
                  }
              />
              <Route
                  path="/internal-transfer-portal"
                  element={
                      <AuthGuard allowedPositions={["Nijedna"]}>
                          {/* <InternalTransferPortal /> ODKOMENTARISATI */}
                      </AuthGuard>
                  }
              />
              <Route
                  path="/receiver-portal"
                  element={
                      <AuthGuard allowedPositions={["Nijedna"]}>
                          {/* <ReceiverPortal /> ODKOMENTARISATI */}
                      </AuthGuard>
                  }
              />
              <Route
                  path="/transactions-page"
                  element={
                      <AuthGuard allowedPositions={["Nijedna"]}>
                          {/* <TransactionsPage /> ODKOMENTARISATI */}
                      </AuthGuard>
                  }
              />
              <Route
                  path="/cards-portal"
                  element={
                      <AuthGuard allowedPositions={["Nijedna"]}>
                          {/* <CardsPortal /> ODKOMENTARISATI */}
                      </AuthGuard>
                  }
              />

          </Routes>

          <ThemeToggle />
        </BrowserRouter>
      </ThemeProvider>

  );
}

export default App;
