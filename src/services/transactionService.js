import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiBanking = axios.create({
    baseURL: `${process.env.REACT_APP_BANKING_API_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
});

apiBanking.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`API Request: ${config.method.toUpperCase()} ${config.url} - Token Set`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);


const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.id;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};


export const fetchAccountsForUser = async () => {
    try {
        const userId = getUserIdFromToken();
        if (!userId) {
            console.warn("User ID is missing from token");
            return [];
        }

        console.log(`Fetching accounts for user ID: ${userId}`);
        const response = await apiBanking.get(`/accounts/user/${userId}`);

        return response.data.success && response.data.data?.accounts ? response.data.data.accounts : [];
    } catch (error) {
        console.error("Error fetching user accounts:", error.response?.data || error.message);
        return [];
    }
};

export const fetchAccountsTransactions = async (accountId) => {
    try {
        if (!accountId) {
            console.warn("Account ID is missing");
            return [];
        }

        console.log(`Fetching transactions for account ID: ${accountId}...`);
        const response = await apiBanking.get(`/accounts/${accountId}/transactions`);

        if (response.status === 204 || !response.data.success) {
            console.warn(`No transactions found for account ID: ${accountId}`);
            return [];
        }

        if (response.data.success) {
            let transactions = response.data.data?.transactions || [];
            transactions.sort((a, b) => b.timestamp - a.timestamp); // Sortiranje po vremenu

            console.log(`Transactions for account ${accountId}:`, transactions);
            return transactions.map((t) => ({
                id: t.id || "N/A",
                sender: t.fromAccountId?.ownerID || "N/A",
                senderAccount: t.fromAccountId?.accountNumber || "N/A",
                receiver: t.toAccountId?.ownerID || "N/A",
                receiverAccount: t.toAccountId?.accountNumber || "N/A",
                amount: t.amount ? `${t.amount} ${t.currency?.code || "N/A"}` : "N/A",
                currency: t.currency?.code || "N/A",
                status: t.transfer?.status || "N/A",
                date: t.timestamp ? new Date(t.timestamp).toLocaleDateString() : "N/A",
                time: t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : "N/A",
                paymentPurpose: t.transfer?.paymentDescription || "N/A",
                paymentCode: t.transfer?.paymentCode || "N/A",
                referenceNumber: t.transfer?.paymentReference || "N/A",
                receiverName: t.transfer?.receiver || "N/A",
                receiverAddress: t.transfer?.address || "N/A",
                transferType: t.transfer?.type || "N/A",
                completedAt: t.transfer?.completedAt ? new Date(t.transfer.completedAt).toLocaleString() : "N/A",
                loanId: t.loanId || "N/A"
            }));
        } else {
            console.warn(`No transactions found for account ${accountId}`);
            return [];
        }
    } catch (error) {
        if (error.response?.status === 404) {
            console.warn(`No transactions found for account ${accountId} (404 Not Found)`);
            return []; // Umesto error-a, vraćamo prazan niz
        }
        console.error("Error fetching account transactions:", error.response?.data || error.message);
        return [];
    }
};

export const fetchTransactionDetails = async (transactionId) => {
    try {
        if (!transactionId) {
            console.warn("Transaction ID is missing");
            return null;
        }

        console.log(`Fetching details for transaction ID: ${transactionId}...`);
        const response = await apiBanking.get(`/transactions/${transactionId}`);

        if (response.status === 204 || !response.data.success) {
            console.warn(`No details found for transaction ID: ${transactionId}`);
            return null;
        }

        if (response.data.success) {
            const transaction = response.data.data;

            return {
                id: transaction.id || "N/A",
                sender: transaction.sender || "N/A",
                senderAccount: transaction.senderAccount || "N/A",
                receiver: transaction.receiver || "N/A",
                receiverAccount: transaction.receiverAccount || "N/A",
                amount: transaction.amount ? `${transaction.amount} ${transaction.currency || "N/A"}` : "N/A",
                currency: transaction.currency || "N/A",
                status: transaction.status || "N/A",
                date: transaction.timestamp ? new Date(transaction.timestamp).toLocaleDateString() : "N/A",
                time: transaction.timestamp ? new Date(transaction.timestamp).toLocaleTimeString() : "N/A",
                paymentPurpose: transaction.paymentPurpose || "N/A",
                paymentCode: transaction.paymentCode || "N/A",
                referenceNumber: transaction.referenceNumber || "N/A"
            };
        } else {
            console.warn(`No transaction details found for ID ${transactionId}`);
            return null;
        }
    } catch (error) {
        if (error.response?.status === 404) {
            console.warn(`Transaction details not found (404) for ID: ${transactionId}`);
            return null; // Vraćamo `null` umesto bacanja error-a
        }
        console.error("Error fetching transaction details:", error.response?.data || error.message);
        return null;
    }
};