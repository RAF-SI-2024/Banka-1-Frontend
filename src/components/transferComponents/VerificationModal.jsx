import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const VerificationModal = ({ open, onClose, onConfirm }) => {
    const [verificationCode, setVerificationCode] = useState('');

    //  rukovanje promenom u inputu
    const handleInputChange = (event) => {
        setVerificationCode(event.target.value);
    };

    // kada korisnik klikne na "Confirm"
    const handleConfirm = () => {
        onConfirm(verificationCode); // Poziva funkciju za potvrdu sa kodom
        setVerificationCode(''); // Resetuje input polje
    };

    return (
        <Modal
            open={open}
            onClose={onClose} // Zatvara modal kada se klikne izvan modalnog prozora
            aria-labelledby="verification-modal-title"
            aria-describedby="verification-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRadius: 2,
                }}
            >
                <Typography id="verification-modal-title" variant="h6" component="h2" align="center">
                    Enter Verification Code
                </Typography>

                {/* Input polje za unos koda za verifikaciju */}
                <TextField
                    id="verification-code"
                    label="Verification Code"
                    value={verificationCode}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />

                {/* Dugmadi za potvrdu i otkazivanje */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirm}
                        disabled={!verificationCode} // Onemogućava dugme dok se ne unese kod
                    >
                        Confirm
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default VerificationModal;
