import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Link as MuiLink } from '@mui/material'; // Renamed to avoid conflict
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // Added RouterLink

// Import our custom components
import AuthCard from '../components/common/AuthCard';
import PasswordField from '../components/common/Password';
import { loginUser } from '../Axios'; // Updated import
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const requestBody = {
        "email": email,
        "password": password
    };

    //Login 
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await loginUser(email, password);
            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate('/home');
        } catch (error) {
            console.log(error);
            alert('Invalid email or password');
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
                    title="Sign In" 
                    icon={<LockOutlinedIcon />}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                        {/* Rest of your form remains the same */}
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
                        <PasswordField
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <MuiLink 
                                    component={RouterLink} 
                                    to="/reset-password" 
                                    variant="body2"
                                    sx={{ cursor: 'pointer' }}
                                >
                                    Forgot password?
                                </MuiLink>
                            </Grid>
                        </Grid>
                    </Box>
                </AuthCard>
            </Box>
        </Container>
    );
};

export default Login;