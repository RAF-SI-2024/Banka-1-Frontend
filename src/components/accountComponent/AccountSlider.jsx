import { useState, useEffect } from "react";
import { Card, CardContent, Button, Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {fetchAccountsId, getUserIdFromToken} from "../../services/AxiosBanking";
import AccountDetailsModal from "../common/AccountDetailsModal";
import {useNavigate} from "react-router-dom";

const AccountSlider = ({ accounts, onAccountChange }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);



    const prevAccount = () => {
        setCurrentIndex((prev) => (prev === 0 ? accounts.length - 1 : prev - 1));
        onAccountChange(accounts[(currentIndex - 1 + accounts.length) % accounts.length]?.id);
    };

    const nextAccount = () => {
        setCurrentIndex((prev) => (prev === accounts.length - 1 ? 0 : prev + 1));
        onAccountChange(accounts[(currentIndex + 1) % accounts.length]?.id);
    };

    const openAccountDetails = (account) => {
        setSelectedAccount(account);
        setIsModalOpen(true);
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
                        {accounts[currentIndex].subtype}
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
                        <Button  onClick={() =>
                            navigate("/new-payment-portal", {
                                state: { account: accounts[currentIndex] } // Prosleđivanje trenutnog računa
                            })
                        }  sx={{ backgroundColor: '#18181f', color: 'white', padding: '6px 16px', borderRadius: 1, minWidth:120 }}>
                            New payment
                        </Button>
                        <Button onClick={() => openAccountDetails(accounts[currentIndex])} sx={{ backgroundColor: '#18181f', color: 'white', padding: '6px 16px', borderRadius: 1 , minWidth:120}}>
                            Details
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <IconButton onClick={nextAccount} sx={{color: 'white', borderRadius: '50%', border: '2px solid white',padding:'3px', '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.1)',},}}>
                <ChevronRightIcon />
            </IconButton>

            {/* Modal za detalje računa */}
            <AccountDetailsModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                account={selectedAccount} // Prosleđivanje selektovanog računa u modal
            />
        </Box>
    );
};

export default AccountSlider;
