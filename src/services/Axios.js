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



export default api;
