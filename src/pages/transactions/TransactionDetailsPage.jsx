import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTransactionDetails } from "../../services/transactionService";
import TransactionDetailsModal from "../../components/transactionTable/TransactionDetailsModal";
const TransactionDetailsPage = () => {
    const { id } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        fetchTransactionDetails(id).then(setTransaction);
    }, [id]);

    return (
        <>
            <TransactionDetailsModal
                open={open}
                onClose={() => setOpen(false)}
                transaction={transaction}
            />
        </>
    );
};

export default TransactionDetailsPage;