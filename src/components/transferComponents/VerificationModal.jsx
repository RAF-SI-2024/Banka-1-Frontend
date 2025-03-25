import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const VerificationModal = ({ open, onClose, onConfirm }) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [showFullContent, setShowFullContent] = useState(false);

    const handleInputChange = (event) => {
        setVerificationCode(event.target.value);
    };

    const handleConfirm = () => {
        onConfirm(verificationCode);
        setVerificationCode('');
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
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
                {!showFullContent ? (
                    <>
                        <Typography variant="body1" align="center">
                            Ovaj modal prikazuje neki uvodni tekst.
                        </Typography>
                        <Typography variant="body1" align="center">
                            Kliknite na "Continue" da nastavite.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Button variant="outlined" color="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" onClick={() => setShowFullContent(true)}>
                                Continue
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography id="verification-modal-title" variant="h6" component="h2" align="center">
                            Enter Verification Code
                        </Typography>
                        <TextField
                            id="verification-code"
                            label="Verification Code"
                            value={verificationCode}
                            onChange={handleInputChange}
                            variant="outlined"
                            fullWidth
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Button variant="outlined" color="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleConfirm}
                                disabled={!verificationCode}
                            >
                                Confirm
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default VerificationModal;
