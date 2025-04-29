import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Toolbar,
} from "@mui/material";
import { getContracts, executeOffers } from "../../services/AxiosTrading";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/mainComponents/Sidebar";
import {toast, ToastContainer} from "react-toastify";

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [filter, setFilter] = useState("valid");
  const [userId, setUserId] = useState(null);

  const mapContractData = (contract) => {
    return {
      ID: contract.id,
      StrikePrice: contract.strikePrice,
      Premium: contract.premium,
      Quantity: contract.quantity,
      SettlementAt: contract.settlementDate,
      IsExercised: contract.isExercised,
      BuyerID: contract.buyerId || contract.remoteBuyerId,
      SellerID: contract.sellerId || contract.remoteSellerId,
      portfolio: {
        security: {
          ticker: contract.ticker,
          name: contract.securityName || contract.ticker
        }
      }
    };
  };

  const fetchContracts = async () => {
    try {
      const res = await getContracts();
      const mappedContracts = (res.data || []).map(mapContractData);
      setContracts(mappedContracts);
    } catch (error) {
      console.error("Greška pri učitavanju ugovora:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
    fetchContracts();
  }, []);

  const isValid = (contract) => {
    const today = new Date();
    const settlementDate = new Date(contract.SettlementAt);
    return settlementDate >= today;
  };

  const handleExecute = async (id) => {
    try {
      await executeOffers(id);
      toast.success("Successfully executed order.");
      await fetchContracts();
      //window.location.reload();
    } catch (error) {
      toast.error("The order failed to execute, the account doesn't have sufficient funds.");
      console.error("Greška pri izvršavanju ugovora:", error);
    }
  };

  const filteredContracts = contracts.filter((c) =>
      filter === "valid" ? isValid(c) : !isValid(c)
  );

  const buyerContracts = filteredContracts.filter((c) => c.BuyerID === userId || c.BuyerID === "111".concat(userId));
  const sellerContracts = filteredContracts.filter((c) => c.SellerID === c.BuyerID === "111".concat(userId));

  const renderContracts = (title, data, showExecute = false, role) => (
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {title}
        </Typography>
        {data.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
              You have no contracts as a {role}.
            </Typography>
        ) : (
            <Grid container spacing={3}>
              {data.map((contract) => {
                const sec = contract.portfolio?.security || {};
                const expired = !isValid(contract);

                return (
                    <Grid item xs={12} sm={6} md={4} key={contract.ID}>
                      <Card
                          variant="outlined"
                          sx={{
                            backgroundColor: expired ? "#f5f5f5" : "inherit",
                            position: "relative",
                            height: "100%",
                          }}
                      >
                        <CardContent>
                          <Typography variant="h6">
                            {sec.ticker} - {sec.name}
                          </Typography>

                          {expired && (
                              <Chip
                                  label="Expired"
                                  color="default"
                                  size="small"
                                  sx={{ position: "absolute", top: 16, right: 16 }}
                              />
                          )}

                          <Divider sx={{ my: 1 }} />
                          <Typography>
                            <strong>Quantity:</strong> {contract.Quantity}
                          </Typography>
                          <Typography>
                            <strong>Strike price:</strong> ${contract.StrikePrice}
                          </Typography>
                          <Typography>
                            <strong>Premium:</strong> ${contract.Premium}
                          </Typography>
                          <Typography>
                            <strong>Settlement:</strong>{" "}
                            {new Date(contract.SettlementAt).toLocaleDateString()}
                          </Typography>

                          {!expired && showExecute && !contract.IsExercised && (
                              <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleExecute(contract.ID)}
                                >
                                  Execute
                                </Button>
                              </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                );
              })}
            </Grid>
        )}
      </Box>
  );

  return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <Toolbar />
          <Typography variant="h4" gutterBottom>
            OTC Contracts
          </Typography>

          <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(e, val) => val && setFilter(val)}
              sx={{ mb: 4 }}
          >
            <ToggleButton value="valid">Valid</ToggleButton>
            <ToggleButton value="expired">Expired</ToggleButton>
          </ToggleButtonGroup>

          {renderContracts("As buyer", buyerContracts, true, "buyer")}
          {renderContracts("As seller", sellerContracts, false, "seller")}

        </Box>
        <ToastContainer position="bottom-right"/>
      </Box>
  );
};

export default ContractsPage;