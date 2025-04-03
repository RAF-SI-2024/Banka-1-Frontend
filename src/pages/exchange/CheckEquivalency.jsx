import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    MenuItem,
    TextField,
    Toolbar,
    Typography,
    Alert,
    useTheme
} from '@mui/material';
import Sidebar from '../../components/mainComponents/Sidebar';
import { previewExchangeTransfer, previewForeignExchangeTransfer } from '../../services/AxiosBanking';

const CheckEquivalency = () => {
    const theme = useTheme();
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('RSD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const supportedCurrencies = ['EUR', 'CHF', 'USD', 'GBP', 'JPY', 'CAD', 'AUD', 'RSD'];

    const getCountryCode = (currency) => {
        const map = {
            EUR: 'eu', CHF: 'ch', USD: 'us', GBP: 'gb',
            JPY: 'jp', CAD: 'ca', AUD: 'au', RSD: 'rs'
        };
        return map[currency] || 'xx';
    };

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
            let conversionResult;
            if (fromCurrency === toCurrency) {
                conversionResult = {
                    convertedAmount: numericAmount,
                    provision: 0,
                    finalAmount: numericAmount,
                    fee: 0,
                    exchangeRate: 1
                };
            } else if (fromCurrency === "RSD" || toCurrency === "RSD") {
                conversionResult = await previewExchangeTransfer(fromCurrency, toCurrency, numericAmount);
            } else {
                conversionResult = await previewForeignExchangeTransfer(fromCurrency, toCurrency, numericAmount);
            }

            // Handle different response formats
            if (fromCurrency === toCurrency || fromCurrency === "RSD" || toCurrency === "RSD") {
                setResult({
                    originalAmount: numericAmount,
                    convertedAmount: conversionResult.convertedAmount.toFixed(2),
                    commission: conversionResult.provision.toFixed(2),
                    finalAmount: conversionResult.finalAmount.toFixed(2),
                    exchangeRate: conversionResult.exchangeRate.toFixed(6),
                    fromCurrency: fromCurrency,
                    toCurrency: toCurrency
                });
            } else {
                // Handle foreign exchange response
                setResult({
                    originalAmount: numericAmount,
                    firstExchangeRate: conversionResult.firstExchangeRate.toFixed(6),
                    secondExchangeRate: conversionResult.secondExchangeRate.toFixed(6),
                    provision: conversionResult.provision.toFixed(2),
                    finalAmount: conversionResult.finalAmount.toFixed(2),
                    fromCurrency: fromCurrency,
                    toCurrency: toCurrency
                });
            }
        } catch (err) {
            setError('Failed to convert currency. Please try again later.');
            console.error('Error converting currency:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                <Toolbar />
                <Container maxWidth="md">
                    <Box display="flex" flexDirection="column" gap={3} alignItems="center">
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{ textAlign: 'center', fontSize: { xs: '1.8rem', md: '2.4rem' } }}
                        >
                            Currency Converter
                        </Typography>

                        <Card sx={{ width: '100%', borderRadius: 3, boxShadow: 3, p: 3 }}>
                            <CardHeader
                                title="Enter Conversion Details"
                                sx={{ px: 0, pb: 2, typography: 'h6', fontWeight: 600 }}
                            />
                            <CardContent sx={{ px: 0 }}>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <TextField
                                        fullWidth
                                        label="Amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        InputProps={{ sx: { height: 56, fontSize: '1.1rem' } }}
                                        InputLabelProps={{ sx: { fontSize: '1rem' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        select
                                        label="From Currency"
                                        value={fromCurrency}
                                        onChange={(e) => setFromCurrency(e.target.value)}
                                        SelectProps={{
                                            renderValue: (value) => (
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <img
                                                        src={`https://flagcdn.com/24x18/${getCountryCode(value)}.png`}
                                                        alt={`${value} flag`}
                                                        width="20"
                                                        height="15"
                                                    />
                                                    <Typography fontSize="1rem">{value}</Typography>
                                                </Box>
                                            )
                                        }}
                                        InputProps={{ sx: { height: 56, fontSize: '1.1rem' } }}
                                        InputLabelProps={{ sx: { fontSize: '1rem' } }}
                                    >
                                        {supportedCurrencies.map((currency) => (
                                            <MenuItem key={currency} value={currency}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <img
                                                        src={`https://flagcdn.com/24x18/${getCountryCode(currency)}.png`}
                                                        alt={`${currency} flag`}
                                                        width="20"
                                                        height="15"
                                                    />
                                                    {currency}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        select
                                        label="To Currency"
                                        value={toCurrency}
                                        onChange={(e) => setToCurrency(e.target.value)}
                                        SelectProps={{
                                            renderValue: (value) => (
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <img
                                                        src={`https://flagcdn.com/24x18/${getCountryCode(value)}.png`}
                                                        alt={`${value} flag`}
                                                        width="20"
                                                        height="15"
                                                    />
                                                    <Typography fontSize="1rem">{value}</Typography>
                                                </Box>
                                            )
                                        }}
                                        InputProps={{ sx: { height: 56, fontSize: '1.1rem' } }}
                                        InputLabelProps={{ sx: { fontSize: '1rem' } }}
                                    >
                                        {supportedCurrencies.map((currency) => (
                                            <MenuItem key={currency} value={currency}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <img
                                                        src={`https://flagcdn.com/24x18/${getCountryCode(currency)}.png`}
                                                        alt={`${currency} flag`}
                                                        width="20"
                                                        height="15"
                                                    />
                                                    {currency}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleConversion}
                                        disabled={!amount || loading}
                                        sx={{
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            backgroundColor: theme.palette.primary.dark,
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: '#2e2e6a',
                                                transform: 'scale(1.01)',
                                                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                                            },
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Convert'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>

                        {error && (
                            <Alert severity="error" sx={{ width: '100%', fontSize: '1rem' }}>
                                {error}
                            </Alert>
                        )}

                        {result && (
                            <Card sx={{ width: '100%', borderRadius: 3, boxShadow: 3, p: 3 }}>
                                <CardHeader
                                    title="Conversion Result"
                                    sx={{ px: 0, pb: 2, typography: 'h6', fontWeight: 600 }}
                                />
                                <CardContent sx={{ px: 0 }}>
                                    <Box display="flex" flexDirection="column" gap={1.5}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <img
                                                src={`https://flagcdn.com/24x18/${getCountryCode(result.fromCurrency)}.png`}
                                                alt={`${result.fromCurrency} flag`}
                                                width="20"
                                                height="15"
                                            />
                                            <Typography fontSize="1rem" fontWeight={600}>
                                                {result.fromCurrency}
                                            </Typography>
                                            <Typography fontSize="1rem" fontWeight={600}>→</Typography>
                                            <img
                                                src={`https://flagcdn.com/24x18/${getCountryCode(result.toCurrency)}.png`}
                                                alt={`${result.toCurrency} flag`}
                                                width="20"
                                                height="15"
                                            />
                                            <Typography fontSize="1rem" fontWeight={600}>
                                                {result.toCurrency}
                                            </Typography>
                                        </Box>

                                        <Typography fontSize="1rem">Original: {result.originalAmount} {result.fromCurrency}</Typography>

                                        {'convertedAmount' in result && (
                                            <>
                                                <Typography fontSize="1rem">Converted: {result.convertedAmount} {result.toCurrency}</Typography>
                                                <Typography fontSize="1rem">Commission: {result.commission} {'RSD'}</Typography>
                                                <Typography fontSize="1rem">Final: {result.finalAmount} {result.toCurrency}</Typography>
                                                <Typography fontSize="1rem">Exchange Rate: {result.exchangeRate}</Typography>
                                            </>
                                        )}

                                        {'firstExchangeRate' in result && (
                                            <>
                                                <Typography fontSize="1rem">First Rate: {result.firstExchangeRate}</Typography>
                                                <Typography fontSize="1rem">Second Rate: {result.secondExchangeRate}</Typography>
                                                <Typography fontSize="1rem">Commission: {result.provision} {'RSD'}</Typography>
                                                <Typography fontSize="1rem">Final: {result.finalAmount} {result.toCurrency}</Typography>
                                            </>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default CheckEquivalency;