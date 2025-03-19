import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    Container,
    Grid,
    TextField,
    Button,
    Alert,
    MenuItem,
    CircularProgress,
    Box,
    Toolbar
} from '@mui/material';
import { convertCurrency } from '../../services/AxiosBanking';
import Sidebar from '../../components/mainComponents/Sidebar';

const CheckEquivalency = () => {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('RSD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const supportedCurrencies = ['EUR', 'CHF', 'USD', 'GBP', 'JPY', 'CAD', 'AUD', 'RSD'];

    const handleConversion = async () => {
        if (!amount) return;

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) {
            setError('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const conversionResult = await convertCurrency(numericAmount, fromCurrency, toCurrency);
            setResult({
                originalAmount: conversionResult.originalAmount,
                convertedAmount: conversionResult.convertedAmount.toFixed(2),
                commission: conversionResult.commission.toFixed(2)
            });
        } catch (err) {
            setError('Failed to convert currency. Please try again later.');
            console.error('Error converting currency:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader
                            title="Currency Converter"
                            sx={{ bgcolor: 'primary.main', color: 'white' }}
                        />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="From Currency"
                                        value={fromCurrency}
                                        onChange={(e) => setFromCurrency(e.target.value)}
                                    >
                                        {supportedCurrencies.map(currency => (
                                            <MenuItem key={currency} value={currency}>
                                                {currency}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="To Currency"
                                        value={toCurrency}
                                        onChange={(e) => setToCurrency(e.target.value)}
                                    >
                                        {supportedCurrencies.map(currency => (
                                            <MenuItem key={currency} value={currency}>
                                                {currency}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleConversion}
                                        disabled={!amount || loading}
                                        fullWidth
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Convert'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {result && (
                        <Card>
                            <CardHeader
                                title="Conversion Result"
                                sx={{ bgcolor: 'success.main', color: 'white' }}
                            />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Alert severity="info">
                                            Original Amount: {result.originalAmount} {fromCurrency}
                                        </Alert>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Alert severity="success">
                                            Converted Amount: {result.convertedAmount} {toCurrency}
                                        </Alert>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Alert severity="warning">
                                            Commission (1%): {result.commission} {toCurrency}
                                        </Alert>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Container>
    );

    return (
        <>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` }, ml: { sm: '240px' } }}>
                <Toolbar /> {/* This creates space for the AppBar */}
                {renderContent()}
            </Box>
        </>
    );
};

export default CheckEquivalency; 