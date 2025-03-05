import axios from "axios";

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


export const fetchAccounts = async () => {
  try {
    const response = await api.get("/accounts");
    return response.data.accounts;  // vraca niz racuna
  } catch (error) {
    console.error("Error fetching accounts:", error);
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


export default api;
