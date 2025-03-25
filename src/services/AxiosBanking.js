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
      console.error("Accounts is not an array, type:", typeof accounts);
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
    console.log("rec:" + response.data);
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
    console.log("Account id: " + accountId);
    const response = await apiBanking.get(`/cards/${accountId}`);
    console.log(response);
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
      cardType: cardType,
      cardBrand: cardBrand,
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
    const response = await apiBanking.post(`/cards/${cardId}/name`, {
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
    const response = await apiBanking.post(`/cards/${cardId}/limit`, {
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
    const response = await apiBanking.post(
        `/cards/${cardId}`,
        { status },
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
    const response = await apiBanking.post(
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
    const response = await apiBanking.get(
        `/accounts/${accountId}/transactions`
    );
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

export const updateAccount = async (accountId, ownerId, account) => {
  try {
    const response = await apiBanking.put(
        `/accounts/user/${ownerId}/${accountId}`,
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

export const fetchRecipientsForFast = async (accountId) => {
  try {
    console.log("AccountId = " + accountId);
    const response = await apiBanking.get(`/receiver/${accountId}`);

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
      return []; // Ako nije niz, vraćamo prazan niz
    }
  } catch (error) {
    console.error("Error fetching recipients:", error);
    throw error;
  }
};


export const fetchUserLoans = async () => {
  try {
    console.log("Fetching loans for the authenticated user");
    const response = await apiBanking.get("/loans/");
    return response.data;
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw error;
  }
};

export const fetchLoanDetails = async (loan_id) => {
  try {
    console.log(`Fetching details for loan ID: ${loan_id}`);
    const response = await apiBanking.get(`/loans/${loan_id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching loan details for ID ${loan_id}:`, error);
    throw error;
  }
};
export const createRecipientt = async (recipientData) => {
  try {
    const requestBody = {
      ownerAccountId: Number(recipientData.ownerAccountId),
      accountNumber: recipientData.accountNumber,
      fullName: recipientData.fullName,
      address: recipientData.address || "",
    };

    console.log("Sending recipient data:", requestBody);

    const response = await apiBanking.post(`/receiver`, requestBody);

    console.log("Recipient added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
        "Error creating recipient:",
        error.response?.data || error.message
    );
    throw error;
  }
};
export const updateRecipientt = async (recipientId, recipientData) => {
  try {
    console.log(
        `Updating recipient ID: ${recipientId} with data:`,
        recipientData
    );

    if (!recipientId || !recipientData || !recipientData.accountNumber) {
      console.error("Missing recipient data:", recipientData);
      throw new Error("Recipient data is missing required fields.");
    }

    const response = await apiBanking.put(
        `/receiver/${recipientId}`,
        recipientData
    );

    console.log("Recipient update response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
        `Error updating recipient [${recipientId}]:`,
        error.response?.data || error.message
    );
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

export const fetchRemainingInstallments = async (loanId) => {
  try {
    const response = await apiBanking.get(
        `/loans/${loanId}/remaining_installments`
    );
    return response.data;
  } catch (error) {
    console.error(
        `Error fetching remaining installments for loan ${loanId}:`,
        error
    );
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
    const response = await apiBanking.put(
        `/loans/admin/${loan_id}/approve`,
        approvedLoan
    );
    return response;
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw error;
  }
};

export const denyLoan = async (loan_id, deniedLoan) => {
  try {
    const response = await apiBanking.put(
        `/loans/admin/${loan_id}/approve`,
        deniedLoan
    );
    return response;
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw error;
  }
};



// Exchange Rate Functions
export const fetchExchangeRates = async () => {
  try {
    // TODO: Replace with actual API key and endpoint
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR', {
      params: {
        base: 'EUR',
        symbols: ['RSD', 'CHF', 'USD', 'GBP', 'JPY', 'CAD', 'AUD'].join(',')
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};

export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  try {
    const { rates } = await fetchExchangeRates();
    const COMMISSION_RATE = 0.01; // 1% commission

    // Calculate buy and sell rates for all currencies
    const getRates = (currency) => {
      const middleRate = rates[currency];
      return {
        // buyRate: middleRate * 0.99,  // Bank buys at 1% less
        // sellRate: middleRate * 1.01   // Bank sells at 1% more
        buyRate: middleRate,
        sellRate: middleRate
      };
    };

    let convertedAmount;

    if (fromCurrency === toCurrency) {
      // Same currency, no conversion needed
      convertedAmount = amount;
    } else if (fromCurrency === 'RSD') {
      // Converting FROM RSD TO foreign currency
      // Use SELL rate because bank is selling foreign currency
      const { sellRate } = getRates(fromCurrency);
      convertedAmount = amount / sellRate;

      console.log(rates);

    } else if (toCurrency === 'RSD') {
      // Converting FROM foreign currency TO RSD
      // Use BUY rate because bank is buying foreign currency
      const { buyRate } = getRates(toCurrency);
      convertedAmount = amount * buyRate;
    } else {
      // Converting between two foreign currencies
      // First convert to RSD using BUY rate (bank buys fromCurrency)
      // Then convert to target using SELL rate (bank sells toCurrency)
      const { buyRate: fromBuyRate } = getRates(toCurrency);
      const { sellRate: toSellRate } = getRates(fromCurrency);

      // First get amount in RSD
      const amountInRSD = amount * fromBuyRate;
      // Then convert RSD to target currency
      convertedAmount = amountInRSD / toSellRate;
    }

    // Calculate commission
    let finalAmount;
    let commission;
    if(fromCurrency === toCurrency){
      finalAmount = amount;
      commission = 0;
    }else{
      finalAmount = convertedAmount * (1 - COMMISSION_RATE); // Subtract commission
      commission = convertedAmount * COMMISSION_RATE;
    }

    return {
      originalAmount: amount,
      convertedAmount: finalAmount,
      commission: commission,
      commissionRate: COMMISSION_RATE * 100,
      rate: rates[toCurrency],
      fromCurrency,
      toCurrency
    };
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
};

// Submit loan request - podnosenje zahteva za kredit
export const submitLoanRequest = async (loanData) => {
  try {
    console.log("Submitting loan request:", loanData);
    const response = await apiBanking.post("/loans/", {
      loanPurpose: loanData.loanPurpose,
      loanType: loanData.loanType,
      numberOfInstallments: loanData.numberOfInstallments,
      interestType: loanData.interestType,
      loanAmount: loanData.loanAmount,
      salaryAmount: loanData.salaryAmount,
      employmentStatus: loanData.employmentStatus,
      employmentDuration: loanData.employmentDuration,
      phoneNumber: loanData.phoneNumber,
      currencyType: loanData.currencyType,
      accountId: loanData.accountId
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting loan request:", error);
    throw error;
  }
};


export const getPaymentCodes = async () => {
  try {
    const response = await apiBanking.get("/metadata/payment-codes");
    // console.log("aaaa" + response);

    const codes = response.data;
    return codes;
  } catch (error) {
    console.error("Error fetching codes:", error);
    throw error;
  }
};

// Block card
export const blockCard = async (cardId, status) => {
  try {
    const response = await apiBanking.post(`/cards/${cardId}`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error(`Error blocking/unblocking card ${cardId}:`, error);
    throw error;
  }
};

// Deactive card
export const deactivateCard = async (cardId, status) => {
  try {
    const response = await apiBanking.post(`/cards/admin/${cardId}`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error(`Error deactivating/activating card ${cardId}:`, error);
    throw error;
  }
};

export const changingAccountStatus = async (accountId, status) => {
  try {
    const response = await apiBanking.put(`/accounts/${accountId}`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error(`Error changing status for account ${accountId}:`, error);
    throw error;
  }
}

export const fetchExchangeRatesForCurrency = async (currency) => {
  try {
    const response = await apiBanking.get(`/currency/exchange-rates/${currency}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};

export default apiBanking;
