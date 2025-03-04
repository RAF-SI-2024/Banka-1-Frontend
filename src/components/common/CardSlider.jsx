
import React, { useEffect, useState } from "react";
import { useCards } from "../../context/CardContext";
import { Box, Card, CardContent, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CardDetailsModal from "./CardDetailsModal";
import "../../styles/CardSlider.module.css";

const CardSlider = ({ accountId }) => {
  const { cards, fetchCards, loading } = useCards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchCards(accountId);
  }, [accountId]);

  if (loading) {
    return <Typography>Loading cards...</Typography>;
  }

  return (
    <>
      <Box className="card-slider-container">
        <IconButton
          onClick={() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)}
          disabled={cards.length === 0}
        >
          <ArrowBackIosIcon />
        </IconButton>

        {cards.length > 0 ? (
          <Card className="card-slider-card">
            <CardContent>
              <Typography variant="h6">{cards[currentIndex]?.tip} Card</Typography>
              <Typography variant="body2">Account Number: {cards[currentIndex]?.racun_id}</Typography>
              <Typography variant="h5">
                {cards[currentIndex]?.balance} {cards[currentIndex]?.currency}
              </Typography>
              <Button className="card-slider-button" variant="contained" onClick={() => setDetailsModalOpen(true)}>
                Details
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Typography>No cards available</Typography>
        )}

        <IconButton
          onClick={() => setCurrentIndex((prev) => (prev + 1) % cards.length)}
          disabled={cards.length === 0}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {cards.length > 0 && (
        <CardDetailsModal open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} card={cards[currentIndex]} />
      )}
    </>
  );
};

export default CardSlider;
