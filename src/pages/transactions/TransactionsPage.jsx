import React from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import { Box, Card, CardContent, Typography, Tabs, Tab } from "@mui/material";
import { fetchTransactions } from "../../services/transactionService";
import TransactionList from "../../components/transactionTable/TransactionList";

// Komponenta za prikaz liste transakcija

const TransactionsPage = () => {
    const [selectedTab, setSelectedTab] = React.useState(0);
    // State za skladištenje liste transakcija
    const [transactions, setTransactions] = React.useState([]);

    // useEffect se startuje jednom pri mountovanj-u komponente da povuce listu transakcija
    React.useEffect(() => {
        fetchTransactions().then(setTransactions);
    }, []);

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box
                sx={{
                    flexGrow: 1,
                    padding: 3,
                    paddingTop: "80px",
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                {/* Glavni sadrzaj unutar kartice */}
                <Card sx={{ width: "90%", backgroundColor: "#1e1e2e", color: "#fff", borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                            Payment Overview
                        </Typography>
                        <Tabs
                            value={selectedTab}
                            onChange={(_, newValue) => setSelectedTab(newValue)}
                            sx={{
                                "& .MuiTabs-indicator": { backgroundColor: "#F4D03F" },
                                "& .MuiTab-root": { color: "#fff", fontWeight: "bold" },
                                "& .Mui-selected": { color: "#F4D03F" },
                            }}
                        >
                            <Tab label="Domestic Payments" />
                            <Tab label="Exchange Transactions" />
                        </Tabs>
                        {/* Prikaz liste transakcija na osnovu selektovanog taba */}
                        {selectedTab === 0 && <TransactionList transactions={transactions} />}
                        {selectedTab === 1 && <TransactionList transactions={[]} />}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default TransactionsPage;