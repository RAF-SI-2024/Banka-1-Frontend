import React, { useState, useEffect } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Container, 
    Card, 
    CardHeader,
    CardContent,
    CircularProgress,
    Alert,
    Box,
    Toolbar
} from '@mui/material';
import { fetchExchangeRates } from '../../services/AxiosBanking';
import Sidebar from '../../components/mainComponents/Sidebar';

const ExchangeRateList = () => {
    const [exchangeRates, setExchangeRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const supportedCurrencies = ['EUR', 'CHF', 'USD', 'GBP', 'JPY', 'CAD', 'AUD'];

    useEffect(() => {
        const loadExchangeRates = async () => {
            try {
                const response = await fetchExchangeRates();
                setExchangeRates(response.data.rates);
                console.log(response.data.rates);
            } catch (err) {
                setError('Failed to fetch exchange rates. Please try again later.');
                console.error('Error fetching exchange rates:', err);
            } finally {
                setLoading(false);
            }
        };

        loadExchangeRates();
    }, []);

    if (loading) {
        return (
            <>
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` }, ml: { sm: '240px' } }}>
                    <Toolbar />
                    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <CircularProgress />
                    </Container>
                </Box>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` }, ml: { sm: '240px' } }}>
                    <Toolbar />
                    <Container sx={{ mt: 4 }}>
                        <Alert severity="error">{error}</Alert>
                    </Container>
                </Box>
            </>
        );
    }

    return (
        <>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    <Box sx={{ 
                        mt: 4,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Card sx={{ width: '800px' }}>
                        <CardHeader
                            title="Current Exchange Rates (RSD)"
                            sx={{ bgcolor: 'primary.main', color: 'white' }}
                        />
                        <CardContent>
                            <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                <TableRow>
                                    <TableCell>Currency</TableCell>
                                    <TableCell>Buy Rate</TableCell>
                                    <TableCell>Middle Rate</TableCell>
                                    <TableCell>Sell Rate</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {supportedCurrencies.map(currency => {
                                    if (!exchangeRates[currency]) return null;
                                    
                                    const middleRate = exchangeRates[currency];
                                    const buyRate = middleRate * 0.99;
                                    const sellRate = middleRate * 1.01;

                                    return (
                                    <TableRow key={currency}>
                                        <TableCell>{currency}</TableCell>
                                        <TableCell>{buyRate?.toFixed(4)}</TableCell>
                                        <TableCell>{middleRate?.toFixed(4)}</TableCell>
                                        <TableCell>{sellRate?.toFixed(4)}</TableCell>
                                    </TableRow>
                                    );
                                })}
                                </TableBody>
                            </Table>
                            </TableContainer>
                        </CardContent>
                        </Card>
                    </Box>
                    </Box>

        </>
    );
};

export default ExchangeRateList; 