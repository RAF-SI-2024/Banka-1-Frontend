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

// export const createPayment = async (paymentData) => {
//   try {
//     const response = await axios.post(`/api/payments/new-payment`, paymentData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     throw error;
//   }
// };

export const fetchAccounts = async (userId) => {
  try {
    console.log("userId = " + userId)
    const response = await api.get('/accounts/user/${userId}');
    return response.data;

  } catch (error) {
    console.error("Error fetching recipients:", error);
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

export default api;
