import React, { useState, useEffect } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import {getUserIdFromToken} from "../../services/AxiosBanking";

import {
    Box, Card, CardContent, Typography, Tabs, Tab, Button,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField
} from "@mui/material";
import { getUserSecurities } from "../../services/AxiosTrading";

const PortfolioPage = () => {
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
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, padding: 3, paddingTop: "80px", display: "flex", justifyContent: "center" }}>
                <Card sx={{ width: "90%", backgroundColor: "#1e1e2e", color: "#fff", borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                            My Portfolio
                        </Typography>
                        <Tabs
                            value={selectedTab}
                            onChange={(_, newValue) => setSelectedTab(newValue)}
                            sx={{
                                "& .MuiTabs-indicator": { backgroundColor: "#F4D03F" },
                                "& .MuiTab-root": { color: "#bbb", fontWeight: "bold" },
                                "& .Mui-selected": { color: "#F4D03F" }
                            }}
                        >
                            <Tab label="All Securities" />
                            <Tab label="Public Securities" />
                        </Tabs>
                        <TableContainer component={Paper} sx={{ backgroundColor: "#2a2a3b", marginTop: 2, borderRadius: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: "#F4D03F" }}>Security</TableCell>
                                        <TableCell sx={{ color: "#F4D03F" }}>Symbol</TableCell>
                                        <TableCell sx={{ color: "#F4D03F" }}>Amount</TableCell>
                                        <TableCell sx={{ color: "#F4D03F" }}>Purchase Price</TableCell>
                                        <TableCell sx={{ color: "#F4D03F" }}>Public</TableCell>
                                        <TableCell sx={{ color: "#F4D03F" }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {portfolioData.length > 0 ? (
                                        portfolioData.map((row, index) => (
                                            <TableRow key={row.securityId}>
                                                <TableCell sx={{ color: "#fff" }}>{row.type || "Stock"}</TableCell>
                                                <TableCell sx={{ color: "#fff" }}>{row.ticker}</TableCell>
                                                <TableCell sx={{ color: "#fff" }}>{row.quantity}</TableCell>
                                                <TableCell sx={{ color: "#fff" }}>{row.purchasePrice}</TableCell>
                                                <TableCell
                                                    sx={{ color: "#F4D03F", cursor: "pointer" }}
                                                    onClick={() => handleOpenPopup(index)}
                                                >
                                                    {row.public || 0}
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="warning" size="small">SELL</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} sx={{ textAlign: "center", color: "#fff" }}>
                                                No securities found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ marginTop: 2, display: "flex", gap: 2 }}>
                            <Button variant="contained" color="warning">Profit Info</Button>
                            <Button variant="contained" color="warning">Tax Info</Button>
                        </Box>
                    </CardContent>
                </Card>
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
    );
};

export default PortfolioPage;