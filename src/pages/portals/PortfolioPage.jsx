import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/mainComponents/Sidebar";
import { getUserIdFromToken } from "../../services/AxiosBanking";
import {
  getTaxForUser,
  getUserSecurities,
  updatePublicCount,
} from "../../services/AxiosTrading";
import ProfitInfoModal from "../../components/common/ProfitInfoModal";
import TaxInfoModal from "../../components/common/TaxInfoModal";

import {
  Box, Typography, Tabs, Tab, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Snackbar, Alert
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import styles from "../../styles/Transactions.module.css";

const PortfolioPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [publicCount, setPublicCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [portfolioData, setPortfolioData] = useState([]);
  const [taxData, setTaxData] = useState([]);
  const [profitModalOpen, setProfitModalOpen] = useState(false); 
  const [taxModalOpen, setTaxModalOpen] = useState(false); 
  const [showSuccess, setShowSuccess] = useState(false);

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }
      try {
        const data = await getUserSecurities(userId);
        const tax = await getTaxForUser(userId);
        console.log(data)
        console.log(tax);
        setPortfolioData(data);
        setTaxData(tax.data);
      } catch (error) {
        console.error("Error fetching user securities:", error);
      }
    };

    fetchPortfolio();
  }, [userId]);

  const handleOpenPopup = (index) => {
    setSelectedIndex(index);
    setPublicCount(portfolioData[index]?.public ?? 0);
    setOpenPopup(true);
  };

  const handleClosePopup = () => setOpenPopup(false);

  const handleSavePublicCount = async () => {
    if (selectedIndex !== null) {
      try {
        const updated = [...portfolioData];
        const security = updated[selectedIndex];

        await updatePublicCount(security.ticker, publicCount);
        updated[selectedIndex].public = publicCount;
        setPortfolioData(updated);
        setShowSuccess(true);
      } catch (error) {
        console.error("Failed to update public count", error);
      }
    }
    setOpenPopup(false);
  };

  const handleOpenProfitModal = () => setProfitModalOpen(true);
  const handleCloseProfitModal = () => setProfitModalOpen(false);
  const handleOpenTaxModal = () => setTaxModalOpen(true);
  const handleCloseTaxModal = () => setTaxModalOpen(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("sr-RS");
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
                <TableCell sx={{ fontWeight: "bold" }}>Profit</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Last Modified</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Public</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolioData.length > 0 ? (
                portfolioData
                  .filter((row) => selectedTab === 0 || row.public > 0)
                  .map((row, index) => (
                    <TableRow key={row.ticker + index}>
                      <TableCell>{row.type || "Stock"}</TableCell>
                      <TableCell>{row.ticker}</TableCell>
                      <TableCell>{row.amount ?? 0}</TableCell>
                      <TableCell>{row.price?.toFixed(2) ?? "0.00"}</TableCell>
                      <TableCell
                        sx={{ color: row.profit >= 0 ? "green" : "red" }}
                      >
                        {(row.profit ?? 0).toFixed(2)} RSD
                      </TableCell>
                      <TableCell>{formatDate(row.last_modified)}</TableCell>
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          color: isDarkMode ? "#F4D03F" : "#333",
                          textAlign: "center",
                        }}
                        onClick={() => handleOpenPopup(index)}
                      >
                        {row.public ?? 0}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => navigate(`/create-order?ticker=${row.ticker}`)}
                        >
                          SELL
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center" }}>
                    No securities found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ marginTop: 2, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={handleOpenProfitModal}>
            Profit Info
          </Button>
          <Button variant="contained" color="primary" onClick={handleOpenTaxModal}>
            Tax Info
          </Button>
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

        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Public count updated successfully!
          </Alert>
        </Snackbar>

        <ProfitInfoModal 
          open={profitModalOpen} 
          onClose={handleCloseProfitModal}
          portfolioData={portfolioData}
        />
        <TaxInfoModal 
          open={taxModalOpen} 
          onClose={handleCloseTaxModal} 
          taxData={taxData}
        />
      </Box>
    </Box>
  );
};

export default PortfolioPage;
