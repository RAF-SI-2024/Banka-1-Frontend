import React, { useEffect, useState } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import {
    Box, Typography, Tabs, Tab, TextField,
    Select, MenuItem, Button, Grid, InputAdornment,
    Collapse, IconButton, Pagination
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TransactionList from "../../components/transactionTable/TransactionList";
import { fetchAccountsForUser, fetchAccountsTransactions } from "../../services/transactionService";
import { Tune, Refresh } from "@mui/icons-material";
import styles from "../../styles/Transactions.module.css";

const TransactionsPage = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    const [selectedTab, setSelectedTab] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState("");
    const [amountFilter, setAmountFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        const loadAccounts = async () => {
            try {
                const userAccounts = await fetchAccountsForUser();
                setAccounts(userAccounts);
                if (userAccounts.length > 0) {
                    setSelectedAccount(userAccounts[0].id);
                }
            } catch (err) {
                console.error("Failed to load accounts:", err);
            }
        };
        loadAccounts();
    }, []);

    useEffect(() => {
        const loadTransactions = async () => {
            setLoading(true);
            setError(null);

            try {
                if (!selectedAccount) {
                    setTransactions([]);
                    setLoading(false);
                    return;
                }

                const accountTransactions = await fetchAccountsTransactions(selectedAccount);
                const formattedTransactions = accountTransactions.map(transaction => {
                    const dateObj = new Date(transaction.timestamp);
                    const formattedDate = dateObj.toLocaleDateString("sr-RS");
                    const formattedTime = dateObj.toLocaleTimeString("sr-RS", {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return {
                        ...transaction,
                        date: formattedDate,
                        time: formattedTime
                    };
                });

                const selectedAccountObj = accounts.find(acc => acc.id === selectedAccount);

                const fakeTransaction = {
                    id: 999,
                    sender: "Ognjen Kojic",
                    senderAccount: "111000100000000120",
                    receiver: "Kojic Ognjen",
                    receiverAccount: "6543210987654321",
                    paymentPurpose: "Test payment",
                    amount: 1500,
                    currency: "RSD",
                    status: "COMPLETED",
                    timestamp: Date.now(),
                    date: new Date().toISOString().split("T")[0],
                    time: new Date().toLocaleTimeString(),
                    paymentCode: "N/A",
                    referenceNumber: "N/A",
                    loanId: null
                };

                let allTransactions = formattedTransactions;

                if (selectedAccountObj?.accountNumber === fakeTransaction.senderAccount) {
                    allTransactions = [...formattedTransactions, fakeTransaction];
                }

                allTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setTransactions(allTransactions);
            } catch (err) {
                console.error("Failed to load transactions:", err);
                setError("Failed to load transactions. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, [selectedAccount]);

    const filteredTransactions = transactions.filter(transaction => {
        if (selectedTab === 1) return false;

        const transactionDate = transaction.date;
        return (
            (!dateFilter || transactionDate === dateFilter) &&
            (!amountFilter || transaction.amount.toString().includes(amountFilter)) &&
            (!statusFilter || transaction.status === statusFilter)
        );
    });

    const resetFilters = () => {
        setDateFilter("");
        setAmountFilter("");
        setStatusFilter("");
    };

    const handlePageChange = (_, value) => {
        setPage(value);
    };

    const paginatedTransactions = filteredTransactions.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    return (
        <Box className={styles.page}>
            <Sidebar />
            <Box
                sx={{
                    backgroundColor: isDarkMode ? "#212128" : "#f1f1f1",
                    padding: "20px",
                    borderRadius: "12px",
                    width: "50%",
                    height: "700px",
                    textAlign: "center",
                    position: "relative",
                }}
            >
                <Typography variant="h5" className={styles.title}>
                    Transactions Overview
                </Typography>
                <Box className={styles.dropdown}>
                    <TextField
                        id="accounts"
                        select
                        label="Select an account"
                        value={selectedAccount || ""}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        helperText="Please select your account"
                        variant="standard"
                        fullWidth
                    >
                        {accounts.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.accountNumber} ({option.currency})
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Tune />}
                    onClick={() => setFiltersVisible(!filtersVisible)}
                    className={styles.addButton}
                >
                    {filtersVisible ? "Hide Filters" : "Show Filters"}
                </Button>

                <Tabs
                    value={selectedTab}
                    onChange={(_, newValue) => setSelectedTab(newValue)}
                    className={styles.tabs}
                >
                    <Tab label="Domestic Payments" />
                    <Tab label="Exchange Transactions" />

                </Tabs>

                <Collapse in={filtersVisible}>
                    <Box className={styles.filterContainer}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    variant="outlined"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder="Amount"
                                    variant="outlined"
                                    value={amountFilter}
                                    onChange={(e) => setAmountFilter(e.target.value)}
                                    inputProps={{ min: 0 }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"></InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Select
                                    fullWidth
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="">All Statuses</MenuItem>
                                    <MenuItem value="COMPLETED">Completed</MenuItem>
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="REJECTED">Rejected</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12} sm={1}>
                                <IconButton onClick={resetFilters} className={styles.refreshButton}>
                                    <Refresh />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Collapse>

                <TransactionList transactions={paginatedTransactions} />

                <Box mt={2} className={styles.paginationBox}>
                    <Pagination
                        count={Math.ceil(filteredTransactions.length / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default TransactionsPage;