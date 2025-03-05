import { useState, useEffect } from "react";
import { Card, CardContent, Button, Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { fetchAccountsId } from './services/axios';

const AccountSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const loadAccounts = async () => {
            const userId = getUserIdFromToken();
            if (userId) {
                const fetchedAccounts = await fetchAccountsId(userId);
                setAccounts(fetchedAccounts || []);
            }
        };

        loadAccounts();
    }, []);

    const prevAccount = () => {
        setCurrentIndex((prev) => (prev === 0 ? accounts.length - 1 : prev - 1));
    };

    const nextAccount = () => {
        setCurrentIndex((prev) => (prev === accounts.length - 1 ? 0 : prev + 1));
    };

    if (accounts.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Typography variant="h6">No accounts available</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                padding: 2,
                backgroundColor: '#18181f',
                borderRadius: 2,
                width: '100%',
                maxWidth: 800,
                margin: 'auto',
            }}
        >
            <IconButton onClick={prevAccount} sx={{color: 'white', borderRadius: '50%', border: '2px solid white',padding:'3px', '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.1)',},}}>
                <ChevronLeftIcon />
            </IconButton>

            <Card sx={{ width: '100%', backgroundColor: '#333339', borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                    <Typography variant="h6" fontWeight="bold">
                        {accounts[currentIndex].name}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 0 }}>
                        {accounts[currentIndex].number}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 2, fontSize: '15px' }}>
                        Available:
                    </Typography>
                    <Typography variant="h6" fontWeight="semibold" sx={{ marginTop: 2 }}>
                        {accounts[currentIndex].balance}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 2 }}>
                        <Button sx={{ backgroundColor: '#18181f', color: 'white', padding: '6px 16px', borderRadius: 1, minWidth:120 }}>
                            New payment
                        </Button>
                        <Button sx={{ backgroundColor: '#18181f', color: 'white', padding: '6px 16px', borderRadius: 1 , minWidth:120}}>
                            Details
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <IconButton onClick={nextAccount} sx={{color: 'white', borderRadius: '50%', border: '2px solid white',padding:'3px', '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.1)',},}}>
                <ChevronRightIcon />
            </IconButton>
        </Box>
    );
};

export default AccountSlider;
