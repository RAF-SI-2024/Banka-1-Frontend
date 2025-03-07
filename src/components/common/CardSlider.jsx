import React, {useEffect, useState} from "react";
import {Box, Card, CardContent, Container, IconButton, Typography} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CardDetailsModal from "./CardDetailsModal";
import "../../styles/CardSlider.module.css";
import {fetchAccountsForUser, fetchUserCards, getUserIdFromToken} from "../../services/AxiosBanking";
import CircularProgress from "@mui/material/CircularProgress";
import CreditCardIcon from "@mui/icons-material/CreditCard";


const CardSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [allCards, setAllCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Single useEffect to handle the entire data fetching flow
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Step 1: Get user ID from token
                const userId = getUserIdFromToken();
                if (!userId) {
                    setError("User ID not found. Please log in.");
                    setIsLoading(false);
                    return;
                }

                // Step 2: Fetch all accounts for this user
                const accounts = await fetchAccountsForUser(userId);
                if (!Array.isArray(accounts) || accounts.length === 0) {
                    console.log("No accounts found or invalid response:", accounts);
                    setIsLoading(false);
                    return;
                }

                // Step 3: Fetch all cards for each account
                const cardsPromises = accounts.map(async (account) => {
                    try {
                        // Assuming you have a function to fetch cards by account ID
                        const response = await fetchUserCards(account.id)
                        console.log("Cards next:")
                        const cards = response.data?.cards;
                        console.log(cards);
                        return Array.isArray(cards) ? cards : [];
                    } catch (err) {
                        console.error(`Error fetching cards for account ${account.id}:`, err);
                        return [];
                    }
                });

                // Wait for all card fetching to complete
                const cardsResults = await Promise.all(cardsPromises);
                console.log("Cards results:", cardsResults);
                // Flatten the array of arrays into a single array of cards
                const combinedCards = cardsResults.flat();
                console.log("Cards loaded:", combinedCards);

                setAllCards(combinedCards);
            } catch (err) {
                console.error("Error in data fetching process:", err);
                setError("Failed to load your card information. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData()
    }, []);

    const goToPrevCard = () => {
        if (allCards.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + allCards.length) % allCards.length);
    };

    const goToNextCard = () => {
        if (allCards.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % allCards.length);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                <CircularProgress/>
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box p={2}>
                <Typography color="error">{error.toString()}</Typography>
            </Box>
        );
    }

    // Empty state
    if (allCards.length === 0) {
        return (
            <Box p={2}>
                <Typography>No cards available for your accounts</Typography>
            </Box>
        );
    }

    const currentCard = allCards[currentIndex];


    return (
        <Container maxWidth="" sx={{padding: "20px"}}>
            <Box className="card-slider-container" maxWidth="md">
                <IconButton onClick={goToPrevCard}>
                    <ArrowBackIosIcon/>
                </IconButton>

                <Card className="card-slider-card">
                    <CardContent>

                        <Box display="flex" flexDirection="column" gap={2}>
                            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                                <Typography variant="h6">{currentCard?.cardNumber}</Typography>
                                <Typography
                                    variant="h6">{capitalizeFirstLetter(currentCard?.cardType)} Card</Typography>
                                <CreditCardIcon/>
                            </Box>
                            <Box gap={2}>
                                <Typography variant="body2">
                                    Account Number: {currentCard?.account.accountNumber}
                                </Typography>
                                <Typography variant="h5">
                                    {currentCard?.balance} {currentCard?.currency}
                                </Typography>
                            </Box>
                            {currentCard?.cardType === "DEBIT" ? (<Box gap={2}>
                                <Typography variant="body2">
                                    {"Balance: "}
                                    {currentCard?.cardLimit >
                                    currentCard?.account.balance ?
                                        currentCard?.account.balance : currentCard?.cardLimit}
                                    {" "}
                                    {currentCard?.account.currencyType}
                                </Typography>
                                <Typography variant="body2">
                                    Expiration date: {new Date(currentCard?.expirationDate * 1000).toLocaleDateString()}
                                </Typography>
                            </Box>) : (<></>)}
                        </Box>
                    </CardContent>
                </Card>

                <IconButton onClick={goToNextCard}>
                    <ArrowForwardIosIcon/>
                </IconButton>
            </Box>

            <CardDetailsModal
                open={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                card={currentCard}
            />
        </Container>
    );
};


function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


export default CardSlider;
