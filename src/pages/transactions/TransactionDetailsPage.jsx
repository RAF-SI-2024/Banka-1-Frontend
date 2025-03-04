import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTransactionDetails } from "../../services/transactionService";
import TransactionDetailsModal from "../../components/transactionTable/TransactionDetailsModal";
// Komponenta za prikaz detalja pojedinačne transakcije
const TransactionDetailsPage = () => {
    const { id } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [open, setOpen] = useState(true);

    // Dohvatanje podataka o transakciji kada se komponenta ucita ili kada se ID promeni
    useEffect(() => {
        fetchTransactionDetails(id).then(setTransaction);
    }, [id]);

    return (
        <>
            {/* Prikaz modala sa detaljima transakcije */}

            <TransactionDetailsModal
                open={open}
                onClose={() => setOpen(false)}
                transaction={transaction}
            />
        </>
    );
};

export default TransactionDetailsPage;