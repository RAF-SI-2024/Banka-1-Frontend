import React, {useState} from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import {Box, Button, Container, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CardSlider from "../../components/common/CardSlider";
import CreateCardModal from "../../components/common/CreateCardModal";

const CardsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);


  return (
    <Box sx={{ display: "flex" }} flexDirection="row">
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
