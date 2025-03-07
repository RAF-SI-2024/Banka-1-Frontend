import React, { useState, useEffect } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import { Box, Typography, Button, Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CardSlider from "../../components/common/CardSlider";
import { useCards } from "../../context/CardContext";
import CreateCardModal from "../../components/common/CreateCardModal";
import {fetchAccountsForUser, getUserIdFromToken} from "../../services/AxiosBanking";

const CardsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // const user = JSON.parse(localStorage.getItem("user"));
  // const accountId = user?.accountID;
  //

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <div style={{ padding: "20px", marginTop: "64px" }}>
          <Container sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Cards
            </Typography>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
              onClick={() => setModalOpen(true)}
            >
              Add Card
            </Button>

              <CardSlider />
          </Container>
        </div>
      </Box>

      <CreateCardModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default CardsPage;
