import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthCard from '../../components/loginComponents/AuthCard';
import PasswordField from '../../components/loginComponents/Password';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { resetPassword } from '../../services/AxiosUser';

const PasswordResetConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState('');

    // Extract token from URL query parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        }
    }, [location]);
    // Validate password complexity
    const validatePassword = (password) => {
        const hasNumber = /[0-9]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        
        if (!hasNumber) {
            return "Password must contain at least 1 number";
        }
        
        if (!hasUpperCase) {
            return "Password must contain at least 1 uppercase letter";
        }
        
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        
        return null; // No validation errors
    };
    // Handle form submission to reset password
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Clear previous errors
        setError('');
        
        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password complexity
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setIsSubmitting(true);

        try {
            // Use the resetPassword function from AxiosUser.js
            await resetPassword(token, password);
            setSuccess(true);
        } catch (err) {
            console.error('Error resetting password:', err);
            setError(
                err.response?.data?.message || 
                'Failed to reset password. The link may have expired.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // If no token is provided in the URL
    if (!token) {
        return (
            <Container component="main" maxWidth="xs">
                <Box sx={{ mt: 8 }}>
                    <AuthCard title="Invalid Reset Link" icon={<LockOutlinedIcon />}>
                        <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
                            The password reset link is invalid or expired.
                        </Alert>
                        <Button 
                            fullWidth 
                            variant="contained"
                            onClick={() => navigate('/reset-password-email')}
                            sx={{ mt: 2 }}
                        >
                            Request New Reset Link
                        </Button>
                        <Button 
                            fullWidth 
                            variant="text"
                            onClick={() => navigate('/login')}
                            sx={{ mt: 1 }}
                        >
                            Back to Login
                        </Button>
                    </AuthCard>
                </Box>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ mt: 8 }}>
                <AuthCard 
                    title="Reset Your Password" 
                    icon={<LockOutlinedIcon />}
                >
                    {success ? (
                        <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Your password has been successfully reset!
                            </Alert>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => navigate('/login')}
                                sx={{ mt: 2 }}
                            >
                                Go to Login
                            </Button>
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Your password must be at least 8 characters long and contain at least 
                                1 number and 1 uppercase letter.
                            </Typography>
                            
                            <PasswordField
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="New Password"
                                autoFocus
                                disabled={isSubmitting}
                            />
                            
                            <PasswordField
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                label="Confirm New Password"
                                disabled={isSubmitting}
                            />
                            
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={!password || !confirmPassword || isSubmitting}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <CircularProgress size={24} sx={{ mr: 1 }} />
                                        Resetting Password...
                                    </>
                                ) : (
                                    'Set New Password'
                                )}
                            </Button>
                            
                            <Button
                                fullWidth
                                variant="text"
                                onClick={() => navigate('/login')}
                                sx={{ mt: 1 }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </AuthCard>
            </Box>
        </Container>
    );
};

export default PasswordResetConfirmation;