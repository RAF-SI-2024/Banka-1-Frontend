import axios from "axios";

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
        if(response === null){
            console.log("null vrednost")
        }
        return response.data.data.accounts; // vraca niz racuna

    } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
    }
};

export const fetchAccountsForUser = async (userId) => {
    try {
        const response = await apiBanking.get(`/accounts/user/${userId}`);
        return response.data;
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
        console.log("AccountId = " + accountId);
        const response = await apiBanking.get(`/receiver/${accountId}`);
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
            fullName: recipientData.fullName,
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
        const response = await apiBanking.get(`/cards?account_id=${accountId}`);
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
    authorizedPerson = null
) => {
    try {
        const requestBody = {
            racun_id: accountId,
            tip: cardType,
        };

        if (authorizedPerson) {
            requestBody.ovlasceno_lice = authorizedPerson;
        }

        const response = await apiBanking.post("/cards", requestBody);
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
        const response = await apiBanking.patch(`/cards/${cardId}`, {
            limit: newLimit,
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
        const response = await apiBanking.patch(`/cards/${cardId}`, { status });
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
        return response.data;
    } catch (error) {
        console.error("Error fetching cards:", error);
        throw error;
    }
};

//ovaj poziv vrv nije dobar
export const updateAccount = async (account) => {
    try {
        const response = await axios.put(
            `/accounts/${account.ownerID}`,
            account
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createInternalTransfer = async (transferData) => {
    try {
        const response = await apiBanking.post("/internal-transfer", transferData);
        return response; // trebalo bi da sadrzi id transakcije : transferId
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

export const verifyOTP = async (otpData) => {
    return await apiBanking.post("/otp/verification", otpData);
};

export default apiBanking;
