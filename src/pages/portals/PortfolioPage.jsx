import React, { useState, useEffect } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import { getUserIdFromToken } from "../../services/AxiosBanking";
import { getUserSecurities } from "../../services/AxiosTrading";

import {
    Box, Typography, Tabs, Tab, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import styles from "../../styles/Transactions.module.css";

const PortfolioPage = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    const [selectedTab, setSelectedTab] = useState(0);
    const [openPopup, setOpenPopup] = useState(false);
    const [publicCount, setPublicCount] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [portfolioData, setPortfolioData] = useState([]);

    const userId = getUserIdFromToken();

    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!userId) {
                console.error("User ID not found in localStorage");
                return;
            }
            try {
                const data = await getUserSecurities(userId);
                setPortfolioData(data);
            } catch (error) {
                console.error("Error fetching user securities:", error);
            }
        };

        fetchPortfolio();
    }, [userId]);

    const handleOpenPopup = (index) => {
        setSelectedIndex(index);
        setPublicCount(portfolioData[index]?.public || 0);
        setOpenPopup(true);
    };

    const handleClosePopup = () => setOpenPopup(false);

    const handleSavePublicCount = () => {
        if (selectedIndex !== null) {
            setPortfolioData((prevData) =>
                prevData.map((item, index) =>
                    index === selectedIndex ? { ...item, public: publicCount } : item
                )
            );
        }
        setOpenPopup(false);
    };

    return (
        <Box className={styles.page}>
            <Sidebar />
            <Box
                className={styles.container}
                sx={{
                    backgroundColor: isDarkMode ? "#212128" : "#f1f1f1",
                    height: "auto",
                    overflowY: "auto",
                    paddingBottom: 4,
                }}
            >
                <Typography variant="h5" className={styles.title}>
                    My Portfolio
                </Typography>

                <Tabs
                    value={selectedTab}
                    onChange={(_, newValue) => setSelectedTab(newValue)}
                    className={styles.tabs}
                >
                    <Tab label="All Securities" />
                    <Tab label="Public Securities" />
                </Tabs>

                <TableContainer
                    component={Paper}
                    sx={{
                        backgroundColor: isDarkMode ? "#2a2a3b" : "#fff",
                        marginTop: 2,
                        borderRadius: 2,
                        boxShadow: "none"
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Security</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Symbol</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Purchase Price</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Public</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {portfolioData.length > 0 ? (
                                portfolioData.map((row, index) => (
                                    <TableRow key={row.securityId}>
                                        <TableCell>{row.type || "Stock"}</TableCell>
                                        <TableCell>{row.ticker}</TableCell>
                                        <TableCell>{row.quantity}</TableCell>
                                        <TableCell>{row.purchasePrice}</TableCell>
                                        <TableCell
                                            sx={{ cursor: "pointer", color: isDarkMode ? "#F4D03F" : "#333" }}
                                            onClick={() => handleOpenPopup(index)}
                                        >
                                            {row.public || 0}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary" size="small">SELL</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                                        No securities found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ marginTop: 2, display: "flex", gap: 2, justifyContent: "center" }}>
                    <Button variant="contained" color="primary">Profit Info</Button>
                    <Button variant="contained" color="primary">Tax Info</Button>
                </Box>

                <Dialog open={openPopup} onClose={handleClosePopup}>
                    <DialogTitle>Set Number of Public Actions</DialogTitle>
                    <DialogContent>
                        <TextField
                            type="number"
                            fullWidth
                            value={publicCount}
                            onChange={(e) => setPublicCount(Math.max(0, Number(e.target.value)))}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePopup} color="secondary">Cancel</Button>
                        <Button onClick={handleSavePublicCount} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default PortfolioPage;