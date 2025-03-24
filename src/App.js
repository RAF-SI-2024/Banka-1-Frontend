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
import { CardProvider } from "./context/CardContext";
import EmployeeBankAccountsPortal from "./pages/portals/EmployeeBankAccountsPortal";
import AccountsPortal from "./pages/portals/AccountsPortal";
import NewPaymentPortal from "./pages/portals/NewPaymentPortal";
import InternalTransferPortal from "./pages/portals/InternalTransferPortal";
import TransactionsPage from "./pages/transactions/TransactionsPage";
import CardsPortal from "./pages/portals/CardsPortal";
import ReceiversPortal from "./pages/portals/ReceiversPortal";
import EmployeeCardsPortal from "./pages/portals/EmployeeCardsPortal";
import CustomerAccountPortal from "./pages/portals/CustomerAccountPortal";
import LoansPortal from "./pages/portals/LoansPortal";
import AllLoansEmployeePortal from "./pages/portals/AllLoansEmployeePortal";
import PendingLoansEmployeePortal from "./pages/portals/PendingLoansEmployeePortal";
import ExchangeRateList from "./pages/exchange/ExchangeRateList";
import CheckEquivalency from "./pages/exchange/CheckEquivalency";
import ActuarialManagementPortal from "./pages/portals/ActuarialManagementPortal";
import PortfolioPage from "./pages/portals/PortfolioPage";
import ActuarySecuritiesBuyingPortal from "./pages/portals/securitiesBuyingPortal/ActuarySecuritiesBuyingPortal";
import ClientSecuritiesBuyingPortal from "./pages/portals/securitiesBuyingPortal/ClientSecuritiesBuyingPortal";
import ViewOrderPortal from "./pages/portals/ViewOrderPortal";
/*
import CompaniesPortal from "./pages/portals/CompaniesPortal";
 */

function App() {
  return (
    <ThemeProvider>
      <CardProvider>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password-email" element={<PasswordReset />} />
            <Route
              path="/reset-password"
              element={<PasswordResetConfirmation />}
            />
            <Route path="/set-password" element={<PasswordSetConfirmation />} />

            {/* Employee-Only Routes */}
            <Route
              path="/employee-home"
              element={
                <AuthGuard
                  allowedPositions={[
                    "WORKER",
                    "MANAGER",
                    "DIRECTOR",
                    "HR",
                    "ADMIN",
                      "SUPERVISOR",
                      "AGENT"
                  ]}
                >
                  <HomePage />
                </AuthGuard>
              }
            />
            <Route
              path="/customer-portal"
              element={
                <AuthGuard
                  allowedPositions={[
                    "WORKER",
                    "MANAGER",
                    "DIRECTOR",
                    "HR",
                    "ADMIN",
                  ]}
                >
                  <CustomerPortal />
                </AuthGuard>
              }
            />
              <Route
                  path="/companies-portal"
                  element={
                      <AuthGuard
                          allowedPositions={[
                              "WORKER",
                              "MANAGER",
                              "DIRECTOR",
                              "HR",
                              "ADMIN",
                          ]}
                      >
                          {/* <CompaniesPortal /> */}
                      </AuthGuard>
                  }
              />
            <Route
              path="/employee-bank-accounts-portal"
              element={
                <AuthGuard
                  allowedPositions={[
                    "WORKER",
                    "MANAGER",
                    "DIRECTOR",
                    "HR",
                    "ADMIN",
                  ]}
                >
                  <EmployeeBankAccountsPortal />
                </AuthGuard>
              }
            />
            <Route
              path="/employee-cards-portal"
              element={
                <AuthGuard
                  allowedPositions={[
                    "WORKER",
                    "MANAGER",
                    "DIRECTOR",
                    "HR",
                    "ADMIN",
                  ]}
                >
                  <EmployeeCardsPortal />
                </AuthGuard>
              }
            />
            <Route
              path={"/all-loans-employee"}
              element={
                <AuthGuard
                  allowedPositions={[
                    "WORKER",
                    "MANAGER",
                    "DIRECTOR",
                    "HR",
                    "ADMIN",
                  ]}
                >
                  <AllLoansEmployeePortal />
                </AuthGuard>
              }
            />
            <Route
              path={"/pending-loans-employee"}
              element={
                <AuthGuard
                  allowedPositions={[
                    "WORKER",
                    "MANAGER",
                    "DIRECTOR",
                    "HR",
                    "ADMIN",
                  ]}
                >
                  <PendingLoansEmployeePortal />
                </AuthGuard>
              }
            />

            {/* Admin-Only Routes */}
            <Route
              path="/employee-portal"
              element={
                <AuthGuard allowedPositions={["ADMIN"]}>
                  <EmployeePortal />
                </AuthGuard>
              }
            />

            {/* Special Employee Routes (Supervisor, Agent) */}
            <Route
              path="/portfolio-page"
              element={
                <AuthGuard allowedPositions={["SUPERVISOR", "AGENT"]}>
                  <PortfolioPage />
                </AuthGuard>
              }
            />
            <Route
              path="/actuary-buying-portal"
              element={
                <AuthGuard allowedPositions={["SUPERVISOR", "AGENT"]}>
                  <ActuarySecuritiesBuyingPortal />
                </AuthGuard>
              }
            />
            <Route
              path="/actuarial-management-portal"
              element={
                <AuthGuard allowedPositions={["SUPERVISOR"]}>
                  <ActuarialManagementPortal />
                </AuthGuard>
              }
            />

            <Route
              path="/view-order-portal"
              element={
                <AuthGuard allowedPositions={["SUPERVISOR"]}>
                  <ViewOrderPortal />
                </AuthGuard>
              }
            />

            <Route
              path="/portfolio-page"
              element={
                <AuthGuard allowedPositions={["NONE", "SUPERVISOR", "AGENT"]}>
                  <PortfolioPage />
                </AuthGuard>
              }
            />

            {/* Customer-Only Routes */}
              <Route
                  path="/customer-home"
                  element={
                      <AuthGuard allowedPositions={["NONE"]}>
                          <CustomerAccountPortal />
                      </AuthGuard>
                  }
              />
            <Route
              path="/client-buying-portal"
              element={
                <AuthGuard allowedPositions={["NONE"]}>
                  <ClientSecuritiesBuyingPortal />
                </AuthGuard>
              }
            />
            <Route
              path="/accounts-portal"
              element={
                <AuthGuard allowedPositions={["NONE"]}>
                  <AccountsPortal />
                </AuthGuard>
              }
            />
            <Route
              path="/new-payment-portal"
              element={
                <AuthGuard allowedPositions={["NONE"]}>
                  <NewPaymentPortal />
                </AuthGuard>
              }
            />
            <Route
              path="/internal-transfer-portal"
              element={
                <AuthGuard allowedPositions={["NONE"]}>
                  <InternalTransferPortal />
                </AuthGuard>
              }
            />
            <Route
              path="/receiver-portal"
              element={
                <AuthGuard allowedPositions={["NONE"]}>
                  <ReceiversPortal />
                </AuthGuard>
              }
            />
            <Route
              path="/transactions-page"
              element={
                <AuthGuard allowedPositions={["NONE"]}>
                  <TransactionsPage />
                </AuthGuard>
              }
            />
            <Route
              path="/cards-portal"
              element={
                <AuthGuard allowedPositions={["NONE"]}>
                  <CardsPortal />
                </AuthGuard>
              }
            />
            <Route
              path="/loans-portal"
              element={
                <AuthGuard allowedPositions={["NONE"]}>
                  <LoansPortal />
                </AuthGuard>
              }
            />
            <Route
              path="/exchange-rates"
              element={
                <AuthGuard allowedPositions={["NONE"]}>
                  <ExchangeRateList />
                </AuthGuard>
              }
            />
            <Route
              path="/currency-converter"
              element={
                <AuthGuard allowedPositions={["NONE"]}>
                  <CheckEquivalency />
                </AuthGuard>
              }
            />
          </Routes>
          <ThemeToggle />
        </BrowserRouter>
      </CardProvider>
    </ThemeProvider>
  );
}

export default App;
