import axios from "axios";
import { jwtDecode } from "jwt-decode";


const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});


// Add auth token to requests
api.interceptors.request.use(
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

// API functions
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const fetchCustomers = async () => {
  try {
    const response = await api.get("/api/users/search/customers");
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const fetchEmployees = async () => {
  try {
    const response = await api.get("/api/users/search/employees");
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const updateEmployeeStatus = async (id, employeeData) => {
  try {
    const response = await api.put(`/api/users/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const fetchCustomerById = async (id) => {
  try {
    const response = await api.get(`/api/customer/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    throw error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await api.put(`/api/customer/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    throw error;
  }
};

export const fetchEmployeeById = async (id) => {
  try {
    const response = await api.get(`/api/users/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error);
    throw error;
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await api.put(`/api/users/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error);
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post("/api/users/reset-password/", {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const setupPassword = async (token, password) => {
  try {
    const response = await api.post("/api/set-password", {
      code: token,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error setting password:", error);
    throw error;
  }
};

export const createEmployee = async (employeeData) => {
  return await api.post("/api/users/employees/", employeeData);
};

export const createCustomer = async (customerData) => {
  return await api.post("/api/customer", customerData);
};


// API BASE URL - promeni ako backend ima drugi endpoint
const API_BASE_URL = "http://localhost:8080/api/accounts";

//token za korisnika
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


export const fetchUserCards = async (accountId) => {
  try {
      const response = await api.get(`/accounts/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching recipients:", error);
      throw error;
    }
};

// Fetch cards linked to an account
// export const createPayment = async (paymentData) => {
//   try {
//     const response = await axios.post(`/api/payments/new-payment`, paymentData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     throw error;
//   }
// };
// export const fetchAccounts = async () => {
//   try {
//     const response = await api.get("/api/accounts");
//     return response.data;
//   } catch (error) {
//   console.error("Error fetching accounts:", error);
//     throw error;
//   }
// };

export const fetchAccount = async (userId) => {
  try {
    const response = await api.get(`/accounts/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipients:", error);
    throw error;
  }
};
export const fetchAccountsTransactions = async (accountId) => {
  try {
    const response = await api.get(`/api/accounts/${accountId}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;

  }
};

export const fetchAccountsId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
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



// primer DTO-a
/**]\[
 {
 "id": 1,
 "name": "Osoba1",
 "number": "XXX-XXXXXXXXXXXXX-XX",
 "balance": "XXXXXXXX,XX RSD"
 },
 {
 "id": 2,
 "name": "Osoba2",
 "number": "YYY-YYYYYYYYYYYYY-YY",
 "balance": "YYYYYYYY,YY RSD"
 }
 ]
 */

// Change card name
export const changeCardName = async (cardId, newName) => {
  try {
    const response = await api.patch(`/cards/${cardId}`, {
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
    const response = await api.get("/accounts");
    return response.data.accounts;  // vraca niz racuna
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};
export const fetchAccounts = async () => {
  try {
    const response = await api.get("/accounts");
    return response.data.accounts;  // vraca niz racuna
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

export const fetchRecipients = async (accountId) => {
  try {
    console.log("AccountId = " + accountId)
    const response = await api.get(`/receiver/${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipients:", error);
    throw error;
  }
};






export const updateRecipient = async (accountId, recipientId,recipientData) => {
  try {
    const newRecipientData ={
      ownerAccountId : accountId,
      accountNumber : recipientData.accountNumber,
      fullName: recipientData.fullName
    }
    const response = await api.put(`/receiver/${recipientId}`, newRecipientData);
    return response.data;
  } catch (error) {
    console.error(`Error updating recipient ${recipientId}:`, error);
    throw error;
  }
};

export const createRecipient = async (accountId, recipientData) => {
  try {


    const newReceiverData ={
      ownerAccountId: accountId,
      accountNumber: recipientData.accountNumber,
      fullName: recipientData.fullName
    }

    const response = await api.post(`/receiver`, newReceiverData);
    return response.data;
  } catch (error) {
    console.error("Error creating receivers:", error);
    throw error;
  }

};




// Fetch cards linked to an account
  export const fetchUserCards = async (accountId) => {
    try {
      const response = await api.get(`/cards?account_id=${accountId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cards for account ${accountId}:`, error);
      throw error;
    }
  };
//Create a card
  export const createCard = async (accountId, cardType, authorizedPerson = null) => {
    try {
      const requestBody = {
        racun_id: accountId,
        tip: cardType,
      };

      if (authorizedPerson) {
        requestBody.ovlasceno_lice = authorizedPerson;
      }

      const response = await api.post("/cards", requestBody);
      return response.data;
    } catch (error) {
      console.error("Error creating a new card:", error);
      throw error;
    }
  };


// Change card name
  export const changeCardName = async (cardId, newName) => {
    try {
      const response = await api.patch(`/cards/${cardId}`, {
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
      const response = await api.patch(`/cards/${cardId}`, {
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
      const response = await api.patch(`/cards/${cardId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for card ${cardId}:`, error);
      throw error;
    }
  };
//Admins only - see users cards and update status
  export const fetchAdminUserCards = async (accountId) => {
    try {
      const response = await api.get(`/cards/admin/${accountId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cards for account ${accountId}:`, error);
      throw error;
    }
  };

  export const updateCardStatusAdmin = async (accountId, cardId, status) => {
    try {
      const response = await api.patch(`/cards/admin/${accountId}?card_id=${cardId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating card status for card ${cardId}:`, error);
      throw error;
    }
  };





// // Fetch cards linked to an account
// export const fetchUserCards = async (accountId) => {
//   try {
//     const response = await api.get(`/cards?account_id=${accountId}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching cards for account ${accountId}:`, error);
//     throw error;
//   }
// };
// //Create a card
// export const createCard = async (accountId, cardType, authorizedPerson = null) => {
//   try {
//     const requestBody = {
//       racun_id: accountId,
//       tip: cardType,
//     };

//     if (authorizedPerson) {
//       requestBody.ovlasceno_lice = authorizedPerson;
//     }

//     const response = await api.post("/cards", requestBody);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating a new card:", error);
//     throw error;
//   }
// };


// // Change card name
// export const changeCardName = async (cardId, newName) => {
//   try {
//     const response = await api.patch(`/cards/${cardId}`, {
//       name: newName,
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error changing name for card ${cardId}:`, error);
//     throw error;
//   }
// };

// // Change card limit
// export const changeCardLimit = async (cardId, newLimit) => {
//   try {
//     const response = await api.patch(`/cards/${cardId}`, {
//       limit: newLimit,
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error changing limit for card ${cardId}:`, error);
//     throw error;
//   }
// };

// // Block or unblock a card
// export const updateCardStatus = async (cardId, status) => {
//   try {
//     const response = await api.patch(`/cards/${cardId}`, { status });
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating status for card ${cardId}:`, error);
//     throw error;
//   }
// };
// //Admins only - see users cards and update status
// export const fetchAdminUserCards = async (accountId) => {
//   try {
//     const response = await api.get(`/cards/admin/${accountId}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching cards for account ${accountId}:`, error);
//     throw error;
//   }
// };

// export const updateCardStatusAdmin = async (accountId, cardId, status) => {
//   try {
//     const response = await api.patch(`/cards/admin/${accountId}?card_id=${cardId}`, { status });
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating card status for card ${cardId}:`, error);
//     throw error;
//   }
// };





  export const fetchTransactions = async (accountId) => {
    try {
      const response = await api.get(`/api/accounts/${accountId}/transactions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transactions for account ${accountId}:`, error);
      throw error;
    }
  };


  export const createInternalTransfer = async (transferData) => {
    try {
      const response = await api.post("/internal-transfer", transferData);
      return response;  // trebalo bi da sadrzi id transakcije : transferId
    } catch (error) {
      console.error("API Error during internal transfer: ", error);
      throw error;
    }
  };


  export const fetchCardsByAccountId = async (accountId) => {
    try {
      const response = await api.get(`/api/cards/admin/${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }
  };

//ovaj poziv vrv nije dobar
  export const updateAccount = async (account) => {
    try {
      const response = await axios.put(`/api/accounts/${account.ownerID}`, account);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const createAccount = async (accountData) => {
    try {
      const response = await api.post("/api/accounts", accountData);
      return response.data;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  };

  export const verifyOTP  = async (otpData) => {
    return await api.post("/otp/verification", otpData);
  };


export const createInternalTransfer = async (transferData) => {
  try {
    const response = await api.post("/internal-transfer", transferData);
    return response;  // trebalo bi da sadrzi id transakcije : transferId
  } catch (error) {
    console.error("API Error during internal transfer: ", error);
    throw error;
  }
};

export const deleteRecipient = async (id) => {
  try {
    const response = await api.get(`/api/cards/admin/${accountId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

    const response = await api.delete(`/receiver/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipients:", error);
    throw error;
  }
};

export const verifyOTP  = async (otpData) => {
  return await api.post("/otp/verification", otpData);
};



export default api;
