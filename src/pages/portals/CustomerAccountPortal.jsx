import AccountSlider from "../../components/accountComponent/AccountSlider";
import React, {useEffect, useState} from "react";
import {Box, Card, CardContent, Container, Typography} from "@mui/material";
import {fetchAccountsId1, getUserIdFromToken} from "../../services/AxiosBanking";
import CircularProgress from "@mui/material/CircularProgress";
import FastPayments from "../../components/transactionComponents/FastPayments";
import RecentTransactions from "../../components/transactionComponents/RecentTransations";
import Sidebar from "../../components/mainComponents/Sidebar";


const CustomerAccountPortal = () =>{

    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const loadAccounts = async () => {
            const userId = getUserIdFromToken();
            if (userId) {
                //   const fetchedAccounts = await fetchAccountsId(userId);
                //  setAccounts(fetchedAccounts || []);
                const fetchedAccounts = await fetchAccountsId1(userId);
                setAccounts(fetchedAccounts || []);
                // Ako postoje računi, postavljamo prvi kao selektovani
                if (fetchedAccounts && fetchedAccounts.length > 0) {
                    setSelectedAccountId(fetchedAccounts[0].id); // Postavljamo prvi račun kao selektovani
                }
            }
            setLoading(false);
        };

        loadAccounts();
    }, []);

    //dok se ucitava circular progress se vidi
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ padding: "20px" }}>
            <Sidebar></Sidebar>
            {/* Naslov */}
            <Typography variant="h4" sx={{ textAlign: "center", marginBottom: "20px", color: "white" }}>
                Client Account Portal
            </Typography>

            {/* Slider za račune, prosledjuju se racuni i koji je trenutno aktuelan racun */}
            <AccountSlider accounts={accounts} onAccountChange={setSelectedAccountId} />

            {/* Brza plaćanja*/}
            <Card sx={{ marginTop: 4, backgroundColor: "#1e1e2e", color: "white" }}>
                <CardContent>
                    <FastPayments accountId={selectedAccountId} />
                </CardContent>
            </Card>

            {/* Poslednje transakcije, prosledjuje se koji je aktuelan account */}
            {selectedAccountId && (
                <Card sx={{ marginTop: 4, backgroundColor: "#18181f", color: "white" }}>
                    <CardContent>
                        <RecentTransactions accountId={selectedAccountId} />
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default CustomerAccountPortal;
