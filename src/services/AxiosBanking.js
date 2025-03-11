import axios from "axios";
import {jwtDecode} from "jwt-decode";

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

            // For debugging - remove in production
            console.log(
                `${config.method.toUpperCase()} ${
                    config.url
                } - Token: ${token.substring(0, 20)}...`
            );
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if(!token) return null;
    try{
        const decoded = jwtDecode(token);
        return decoded.id;
    }catch (error){
        console.error("Invalid token", error);
        return null;
    }

}


export const createAccount = async (accountData) => {
    try {
        const response = await apiBanking.post("/accounts/", accountData);
        return response.data;
    } catch (error) {
        console.error("Error creating account:", error);
        throw error;
    }
};

export const fetchAccounts = async () => {
    try {
        const response = await apiBanking.get("/accounts/");
        console.log(response);
        // if (!response.data) {
        //     return [];
        // }

        const accounts = response.data.data.accounts;
        
        if (!Array.isArray(accounts)) {
            console.error('Accounts is not an array, type:', typeof accounts);
            return [];
        }

        return accounts;
    } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
    }
};

export const fetchAccountsForUser = async () => {
    const userId = getUserIdFromToken();
    try {
        console.log("Running GET /accounts/user/" + userId);
        const response = await apiBanking.get(`/accounts/user/${userId}`);
        const accounts = response.data.data.accounts;
        console.log(accounts);
        return accounts;
    } catch (error) {
        console.error("Error fetching recipients:", error);
        throw error;
    }
};

export const fetchAccountsId = async (id) => {
    try {
        const response = await apiBanking.get(`/accounts/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data.map((account) => ({
            id: account.id,
            name: account.name,
            number: account.number,
            balance: account.balance,
        }));
    } catch (error) {
        console.error(`Error fetching account with ID ${id}:`, error);
        return null;
    }
};

export const fetchRecipients = async (accountId) => {
    try {
        const response = await apiBanking.get(`/receiver/${accountId}`);
        console.log("rec:"+ response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching recipients:", error);
        throw error;
    }
};

export const updateRecipient = async (
    accountId,
    recipientId,
    recipientData
) => {
    try {
        const newRecipientData = {
            ownerAccountId: accountId,
            accountNumber: recipientData.accountNumber,
            fullName: recipientData.fullName,
        };
        const response = await apiBanking.put(
            `/receiver/${recipientId}`,
            newRecipientData
        );
        return response.data;
    } catch (error) {
        console.error(`Error updating recipient ${recipientId}:`, error);
        throw error;
    }
};

export const createRecipient = async (accountId, recipientData) => {
    try {

        const newReceiverData = {
            ownerAccountId: accountId,
            accountNumber: recipientData.accountNumber,
            fullName: recipientData.fullName
        };

        const response = await apiBanking.post(`/receiver`, newReceiverData);
        return response.data;
    } catch (error) {
        console.error("Error creating receivers:", error);
        throw error;
    }
};

// Fetch cards linked to an account
export const fetchUserCards = async (accountId) => {
    try {
        console.log("Account id: " + accountId);
        const response = await apiBanking.get(`/cards/${accountId}`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error(`Error fetching cards for account ${accountId}:`, error);
        throw error;
    }
};

//Create a card
export const createCard = async (
    accountId,
    cardType,
    cardBrand = "VISA",
    authorizedPerson = null
) => {
    try {
        const requestBody = {
            accountID: accountId,
            cardType : cardType,
            cardBrand: cardBrand
        };
        if (authorizedPerson) {
            requestBody.ovlasceno_lice = authorizedPerson;
        }
        const response = await apiBanking.post("/cards/", requestBody);
        return response.data;
    } catch (error) {
        console.error("Error creating a new card:", error);
        throw error;
    }
};

// Change card name
export const changeCardName = async (cardId, newName) => {
    try {
        const response = await apiBanking.patch(`/cards/${cardId}`, {
            name: newName,
        });
        return response.data;
    } catch (error) {
        console.error(`Error changing name for card ${cardId}:`, error);
        throw error;
    }
};

// Change card limit
export const changeCardLimit = async (cardId, newLimit) => {
    try {
        const response = await apiBanking.patch(`/cards/${cardId}/limit`, {
            newLimit: newLimit,
        });
        return response.data;
    } catch (error) {
        console.error(`Error changing limit for card ${cardId}:`, error);
        throw error;
    }
};

// Block or unblock a card
export const updateCardStatus = async (cardId, status) => {
    try {
        const response = await apiBanking.patch(`/cards/${cardId}`, { status},
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            }
        );
        
        return response.data;
    } catch (error) {
        console.error(`Error updating status for card ${cardId}:`, error);
        throw error;
    }
};

//Admins only - see users cards and update status
export const fetchAdminUserCards = async (accountId) => {
    try {
        const response = await apiBanking.get(`/cards/admin/${accountId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching cards for account ${accountId}:`, error);
        throw error;
    }
};

export const updateCardStatusAdmin = async (accountId, cardId, status) => {
    try {
        const response = await apiBanking.patch(
            `/cards/admin/${accountId}?card_id=${cardId}`,
            { status }
        );
        return response.data;
    } catch (error) {
        console.error(`Error updating card status for card ${cardId}:`, error);
        throw error;
    }
};

export const fetchAccountsTransactions = async (accountId) => {
    try {
        const response = await apiBanking.get(`/accounts/${accountId}/transactions`);
        return response.data;
    } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
    }
};

export const fetchCardsByAccountId = async (accountId) => {
    try {
        const response = await apiBanking.get(`/cards/admin/${accountId}`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error fetching cards:", error);
        throw error;
    }
};


export const updateAccount = async (accountId, ownerId, account) => {
    try {
        const response = await apiBanking.put(`/accounts/user/${ownerId}/${accountId}`, account);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createInternalTransfer = async (transferData) => {
    try {
        const response = await apiBanking.post("/internal-transfer", transferData);
        return response.data; // trebalo bi da sadrzi id transakcije : transferId
    } catch (error) {
        console.error("API Error during internal transfer: ", error);
        throw error;
    }
};

export const deleteRecipient = async (id) => {
    try {
        const response = await apiBanking.delete(`/receiver/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recipients:", error);
        throw error;
    }
};

export const createNewMoneyTransfer = async (transferData) => {
    try {
        const response = await apiBanking.post("/money-transfer", transferData);
        return response.data;
    } catch (error) {
        console.error("API Error during new payment transfer: ", error);
        throw error;
    }
};

export const verifyOTP = async (otpData) => {
    console.log(otpData);
    return await apiBanking.post("/otp/verification", otpData);
};

export const fetchAccountsId1 = async (id) => {
    try {
        const response = await apiBanking.get(`/accounts/user/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        // Pristupanje pravom nizu
        const accounts = response.data.data.accounts;

        if (!Array.isArray(accounts)) {
            console.error("Invalid response format:", response.data);
            return [];
        }
        
        //ostavio sam ovako da bi imali sve parametre za details
        return accounts;
        // return accounts.map((account) => ({
        //     id: account.id,
        //     name: account.ownerID,
        //     number: account.accountNumber,
        //     balance: account.balance,
        //     subtype: account.subtype,

        // }));

    } catch (error) {
        console.error(`Error fetching account with ID ${id}:`, error);
        return null;
    }
};

export const fetchRecipientsForFast = async (userId) => {
    try {
        console.log("UserId = " + userId);
        const response = await apiBanking.get(`/receiver/${userId}`);

        // Logujemo celu strukturu odgovora
        console.log("Response data:", response.data);

        // Proveravamo da li postoji 'receivers' unutar 'data'
        const receivers = response.data?.data?.receivers;

        if (Array.isArray(receivers)) {
            const reversedReceivers = receivers.reverse();

            // Vraćamo prve tri osobe nakon obrtanja niza
            return reversedReceivers.slice(0, 3);
        } else {
            console.error("Response data is not an array:", response.data);
            return [];  // Ako nije niz, vraćamo prazan niz
        }
    } catch (error) {
        console.error("Error fetching recipients:", error);
        throw error;
    }
};

export const fetchAllLoansForEmployees = async () => {
    try {
        const response = await apiBanking.get("/loans/admin");
        return response.data;
    } catch (error) {
        console.error("Error fetching loans:", error);
        throw error;
    }
};

export const fetchAllPendingLoans = async () => {
    try {
        const response = await apiBanking.get("/loans/pending");
        return response.data.data.loans;
    } catch (error) {
        console.error("Error fetching loans:", error);
        throw error;
    }
};

export const approveLoan = async (loan_id, approvedLoan) => {
    try {
        const response = await apiBanking.put(`/loans/admin/${loan_id}/approve`, approvedLoan);
        return response;
    } catch (error) {
        console.error("Error fetching loans:", error);
        throw error;
    }
};

export const denyLoan = async (loan_id, deniedLoan) => {
    try {
        const response = await apiBanking.put(`/loans/admin/${loan_id}/approve`, deniedLoan);
        return response;
    } catch (error) {
        console.error("Error fetching loans:", error);
        throw error;
    }
};


export default apiBanking;
