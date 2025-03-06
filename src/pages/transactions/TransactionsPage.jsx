import React, { useEffect, useState } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import { Box, Card, CardContent, Typography, Tabs, Tab } from "@mui/material";
import TransactionList from "../../components/transactionTable/TransactionList";
import { fetchAccountsForUser, fetchAccountsTransactions } from "../../services/transactionService";

const TransactionsPage = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTransactions = async () => {
            setLoading(true);
            setError(null);

            try {
                const userAccounts = await fetchAccountsForUser();
                if (!userAccounts.length) {
                    setTransactions([]);
                    setLoading(false);
                    return;
                }

                const transactionsPromises = userAccounts.map(async (account) => {
                    const accountTransactions = await fetchAccountsTransactions(account.id);

                    if (accountTransactions.length === 0) {
                        console.warn(`No transactions found for account ID: ${account.id}`);
                    }

                    return accountTransactions;
                });

                const allTransactions = (await Promise.allSettled(transactionsPromises))
                    .filter((res) => res.status === "fulfilled")
                    .flatMap((res) => res.value || []);

                const hardcodedTransaction = {
                    id: "0001",
                    accountId: "test-account",
                    sender: "Test Sender",
                    senderAccount: "123-456789-00",
                    receiver: "Test Receiver",
                    receiverAccount: "987-654321-00",
                    amount: 1000,
                    currency: "RSD",
                    status: "COMPLETED",
                    timestamp: new Date().toISOString(),
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                    paymentPurpose: "Payment for services",
                    paymentCode: "289",
                    referenceNumber: "20240001",
                    receiverName: "Test Receiver Name",
                    receiverAddress: "Test Street 123, Belgrade",
                    transferType: "STANDARD",
                    completedAt: new Date().toISOString(),
                    loanId: null
                };

                const updatedTransactions = allTransactions.length === 0 ? [hardcodedTransaction] : allTransactions;

                updatedTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                setTransactions(updatedTransactions);
            } catch (err) {
                console.error("Failed to load transactions:", err);
                setError("Failed to load transactions. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, []);

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, padding: 3, paddingTop: "80px", display: "flex", justifyContent: "center" }}>
                <Card sx={{ width: "90%", backgroundColor: "#1e1e2e", color: "#fff", borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                            Payment Overview
                        </Typography>
                        <Tabs
                            value={selectedTab}
                            onChange={(_, newValue) => setSelectedTab(newValue)}
                            sx={{ "& .MuiTabs-indicator": { backgroundColor: "#F4D03F" }, "& .MuiTab-root": { color: "#fff", fontWeight: "bold" }, "& .Mui-selected": { color: "#F4D03F" } }}
                        >
                            <Tab label="Domestic Payments" />
                            <Tab label="Exchange Transactions" />
                        </Tabs>

                        {loading ? (
                            <Typography>Loading transactions...</Typography>
                        ) : error ? (
                            <Typography color="error">{error}</Typography>
                        ) : transactions.length === 0 ? (
                            <Typography>No transactions found.</Typography>
                        ) : (
                            <TransactionList transactions={transactions} />
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default TransactionsPage;