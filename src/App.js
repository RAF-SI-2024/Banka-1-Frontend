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

// import CustomerAccountPortal from "./pages/portals/CustomerAccountPortal";


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
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/reset-password-email" element={<PasswordReset />} />
                        <Route path="/reset-password" element={<PasswordResetConfirmation />} />
                        <Route path="/set-password" element={<PasswordSetConfirmation />} />

                        {/* Employee-Only Routes (Admin or  not) */}
                        <Route
                            path="/customer-portal"
                            element={
                                <AuthGuard allowedPositions={["WORKER", "MANAGER", "DIRECTOR", "HR", "ADMIN", "NONE"]}>
                                    <CustomerPortal />
                                </AuthGuard>
                            }
                        />

                        <Route
                            path="/employee-bank-accounts-portal"
                            element={
                                <AuthGuard allowedPositions={["WORKER", "MANAGER", "DIRECTOR", "HR", "ADMIN", "NONE"]}>
                                    <EmployeeBankAccountsPortal />
                                </AuthGuard>
                            }
                        />

                        <Route
                            path="/employee-cards-portal"
                            element={
                                <AuthGuard allowedPositions={["WORKER", "MANAGER", "DIRECTOR", "HR", "ADMIN", "NONE"]}>
                                    <EmployeeCardsPortal />
                                </AuthGuard>
                            }
                        />

                        {/* Admin Only */}
                        <Route
                            path="/employee-portal"
                            element={
                                <AuthGuard allowedPositions={["ADMIN"]}>
                                    <EmployeePortal />
                                </AuthGuard>
                            }
                        />
<<<<<<< Updated upstream
=======
                          <Route
                              path="/employee-bank-accounts-portal"
                              element={
                                  <AuthGuard allowedPositions={["Radnik", "Menadžer", "Direktor", "HR", "Admin"]}>
                                       <EmployeeBankAccountsPortal />
                                  </AuthGuard>
                              }
                          />


                          <Route
                              path="/home-portal"
                              element={
                                  <AuthGuard allowedPositions={["Nijedna"]}>
                                       {/*<ClientAccountPortal />*/}
                                  </AuthGuard>
                              }
                          />
                          <Route
                              path="/accounts-portal"
                              element={
                                  <AuthGuard allowedPositions={["Nijedna"]}>
                                       <AccountsPortal />
                                  </AuthGuard>
                              }
                          />
                          <Route
                              path="/new-payment-portal"
                              element={
                                  // <AuthGuard allowedPositions={["Nijedna"]}>
                                       <NewPaymentPortal />
                                  // </AuthGuard>
                              }
                          />
                          <Route
                              path="/internal-transfer-portal"
                              element={
                                  <AuthGuard allowedPositions={["Nijedna"]}>
                                       <InternalTransferPortal />
                                  </AuthGuard>
                              }
                          />
                          <Route
                              path="/receiver-portal"
                              element={
                                  <AuthGuard allowedPositions={["Nijedna"]}>
                                       <ReceiversPortal />
                                  </AuthGuard>
                              }
                          />
                          <Route
                              path="/transactions-page"
                              element={
                                  <AuthGuard allowedPositions={["Nijedna"]}>
                                       <TransactionsPage />
                                  </AuthGuard>
                              }
                          />
                          <Route
                              path="/cards-portal"
                              element={
                                  <AuthGuard allowedPositions={["Nijedna"]}>
                                       <CardsPortal />
                                  </AuthGuard>
                              }
                          />
>>>>>>> Stashed changes

                        {/* Customer-Only Routes */}
                        <Route
                            path="/home"
                            element={
                                <AuthGuard>
                                   <CustomerAccountPortal />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/accounts-portal"
                            element={
                                <AuthGuard>
                                    <AccountsPortal />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/new-payment-portal"
                            element={
                                <AuthGuard>
                                    <NewPaymentPortal />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/internal-transfer-portal"
                            element={
                                <AuthGuard>
                                    <InternalTransferPortal />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/receiver-portal"
                            element={
                                <AuthGuard>
                                    <ReceiversPortal />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/transactions-page"
                            element={
                                <AuthGuard>
                                    <TransactionsPage />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/cards-portal"
                            element={
                                <AuthGuard>
                                    <CardsPortal />
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
