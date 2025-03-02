import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'; 
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../../components/loginComponents/AuthCard';

const PasswordReset = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Handle form submission to request password reset email
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await axios.put('/api/users/reset-password/', {
                email: email
            });
            console.log('Password reset request successful:', response.data);
            setSubmitted(true);
        } catch (err) {
            console.error('Error requesting password reset:', err);
            setError('Failed to request password reset. Please try again.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <AuthCard 
                    title="Reset Password" 
                    icon={<MailOutlineIcon />}
                >
                    {!submitted ? (
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {error && (
                                <Typography color="error" variant="body2">
                                    {error}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={!email}
                            >
                                Reset Password
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link 
                                        onClick={() => navigate('/login')} 
                                        variant="body2"
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        Back to login
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : (
                        <Box sx={{ mt: 1, width: '100%', textAlign: 'center' }}>
                            <Box sx={{ mb: 3 }}>
                                <MailOutlineIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6">Check Your Email</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    If an account exists with {email}, we've sent password reset instructions.
                                </Typography>
                            </Box>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate('/login')}
                                sx={{ mt: 2 }}
                            >
                                Return to Login
                            </Button>
                        </Box>
                    )}
                </AuthCard>
            </Box>
        </Container>
    );
};

export default PasswordReset;
