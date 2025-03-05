import React, {useEffect, useState} from "react";
import { Card, CardContent, Typography, Paper } from "@mui/material";
import {fetchTransactions, fetchTransactionsByAccountId} from "../../services/TansactionService";
import DataTable from "../tables/DataTable";
import TransactionDetailsModal from "./TransactionDetailsModal";


//TODO : povezati sa pravim transakcijama sa becka


//kolone za tabelu
const columns = [
    { field: "receiver", headerName: "Transaction", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "currency", headerName: "Currency", flex: 0.5 },
];

const RecentTransactions = () => {
    //state za otvaranje modala, state za transakcije i odabranu transakciju, id racuna koji je vezan za transakcije
    const [open, setOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [accountId, setAccountId] = useState("2");

    //Mock fetchovanja  transakcija sa servisa
    useEffect(() => {
        const loadTransactions = async () => {
            const data = await fetchTransactionsByAccountId(accountId);
            setTransactions(data);
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


                {/*Tabela*/}
                <DataTable
                    rows={transactions}
                    columns={columns}
                    checkboxSelection={false}
                    onRowClick={handleRowClick}
                />

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

