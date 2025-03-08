import React, {useEffect, useState} from "react";
import { Card, CardContent, Typography, Paper } from "@mui/material";
import DataTable from "../tables/DataTable";
import TransactionDetailsModal from "./TransactionDetailsModal";
import {fetchAccountsTransactions} from "../../services/transactionService";


//TODO : povezati sa pravim transakcijama sa becka


//kolone za tabelu
const columns = [
    { field: "receiverAccount", headerName: "Transaction", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "currency", headerName: "Currency", flex: 0.5 },
];



const RecentTransactions = ({ accountId }) => {
    //state za otvaranje modala, state za transakcije i odabranu transakciju, id racuna koji je vezan za transakcije
    const [open, setOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log("Received accountId:", accountId);

    //Mock fetchovanja  transakcija sa servisa
    useEffect(() => {
        const loadTransactions = async () => {
            if (!accountId) {
                setLoading(false);
                return;
            }
            try {
                const data = await fetchAccountsTransactions(accountId);
                if (data && Array.isArray(data)) {
                    setTransactions(data);
                } else {
                    setTransactions([]);  // Ako podaci nisu u ispravnom formatu, postavi praznu listu
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setTransactions([]);  // Ako dođe do greške, postavi praznu listu
            } finally {
                setLoading(false);
            }
        };
        loadTransactions();
    }, [accountId]);

    // Postavlja izabranu transakciju i otvara modal
    const handleRowClick = (params) => {
        setSelectedTransaction(params);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTransaction(null);
    };


    return (
        <Card sx={ {backgroundColor: "#1e1e2e"}}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                    Latest Transactions
                </Typography>


                {loading ? (
                    <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
                        Loading transactions...
                    </Typography>
                ) : transactions.length === 0 ? (
                    <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
                        This account has no transactions.
                    </Typography>
                ) : (
                    <DataTable
                        rows={transactions}
                        columns={columns}
                        checkboxSelection={false}
                        onRowClick={handleRowClick}
                    />
                )}

                {/*Modal za detalje transakcije*/}
                <TransactionDetailsModal
                    open={open}
                    onClose={handleClose}
                    transaction={selectedTransaction}
                />
            </CardContent>
        </Card>
    );
};

export default RecentTransactions;

