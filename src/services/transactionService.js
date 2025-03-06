import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiBanking = axios.create({
    baseURL: "http://localhost:8082",
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
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Izvlači userId iz JWT tokena
 */
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

/**
 * Dohvata sve račune ulogovanog korisnika
 */
export const fetchAccountsForUser = async () => {
    try {
        const userId = getUserIdFromToken(); // Automatski dohvata userId
        if (!userId) {
            console.warn("User ID is missing from token");
            return [];
        }

        console.log(` Fetching accounts for user ID: ${userId}`);
        const response = await apiBanking.get(`/accounts/user/${userId}`);

        if (response.data.success && response.data.data?.accounts.length > 0) {
            console.log(" Accounts fetched:", response.data.data.accounts);
            return response.data.data.accounts;
        } else {
            console.warn(`No accounts found for user ${userId}`);
            return [];
        }
    } catch (error) {
        console.error(" Error fetching user accounts:", error.response?.data || error.message);
        return [];
    }
};

/**
 * Dohvata transakcije za određeni račun
 */
export const fetchAccountsTransactions = async (accountId) => {
    try {
        if (!accountId) {
            console.warn(" Account ID is missing");
            return [];
        }

        console.log(`Fetching transactions for account ID: ${accountId}...`);
        const response = await apiBanking.get(`/accounts/${accountId}/transactions`);

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
            console.warn(` Error fetching transactions for account ${accountId}: ${response.data?.error || "Unknown error"}`);
            return [];
        }
    } catch (error) {
        console.error(" Error fetching account transactions:", error.response?.data || error.message);
        return [];
    }
};

/**
 * Dohvata SVE transakcije svih računa korisnika
 */
export const fetchAllUserTransactions = async () => {
    try {
        // 1. Dohvati račune korisnika
        const accounts = await fetchAccountsForUser();

        if (!accounts || accounts.length === 0) {
            console.warn(" No accounts found for user");
            return [];
        }

        const transactionsPromises = accounts.map((account) => fetchAccountsTransactions(account.id));

        const allTransactions = (await Promise.all(transactionsPromises)).flat();

        allTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        console.log("All user transactions fetched:", allTransactions);
        return allTransactions;
    } catch (error) {
        console.error(" Error fetching all user transactions:", error.message);
        return [];
    }
};
