import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiTrading = axios.create({
  baseURL: `${process.env.REACT_APP_TRADING_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiTrading.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;

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

export const getActuaries = async () => {
  try {
    const response = await apiTrading.get("/actuaries");
    return response.data;
  } catch (error) {
    console.error("Error fetching actuaries:", error);
    throw error;
  }
};

export const getActuaryById = async (id) => {
  try {
    const response = await apiTrading.get(`/actuaries/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching actuary with ID ${id}:`, error);
    throw error;
  }
};

export const updateActuaryLimit = async (id, newLimit) => {
  try {
    const response = await apiTrading.put(`/actuaries/${id}/limit`, {
      limit: newLimit,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating limit for actuary ${id}:`, error);
    throw error;
  }
};

export const getSecurities = async () => {
  try {
    const response = await apiTrading.get("/securities");
    return response.data;
  } catch (error) {
    console.error("Error fetching securities:", error);
    throw error;
  }
};

export const getUserSecurities = async (userId) => {
  try {
    const response = await apiTrading.get(`/securities/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching securities for user ${userId}:`, error);
    throw error;
  }
};

export const getTaxForUser = async (userId) => {
  try {
    const response = await apiTrading.get(`/tax/dashboard/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tax for user:`, error);
    throw error;
  }
};

export const getAvailableSecurities = async () => {
  try {
    const response = await apiTrading.get("/securities/available");
    return response.data;
  } catch (error) {
    console.error("Error fetching available securities:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await apiTrading.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await apiTrading.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling order ${orderId}:`, error);
    throw error;
  }
};

export const updateOrder = async (orderId, action, newQuantity = null) => {
  try {
    const payload = { action };
    if (action === "modify" && newQuantity !== null) {
      payload.newQuantity = newQuantity;
    }
    const response = await apiTrading.put(`/orders/${orderId}/action`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    throw error;
  }
};

export const resetUsedLimit = async (id) => {
  try {
    await apiTrading.put(`/actuaries/${id}/reset-used-limit`);
    return { message: "Used limit reset successfully" };
  } catch (error) {
    console.error("Error resetting used limit:", error);
    throw error;
  }
};

export const fetchSecurities = async () => {
  try {
    const response = await apiTrading.get(`/securities`);
    return response.data;
  } catch (error) {
    console.error("Greška pri dohvatanju hartija:", error);
    throw error;
  }
};

export const fetchAvailableSecurities = async () => {
  try {
    const response = await apiTrading.get(`/securities/available`);
    return response.data;
  } catch (error) {
    console.error("Greška pri dohvatanju dostupnih hartija:", error);
    throw error;
  }
};

export const updateSecurity = async (ticker, newData) => {
  try {
    const response = await apiTrading.put(`/securities/${ticker}`, newData);
    return response.data;
  } catch (error) {
    console.error(`Greška pri ažuriranju hartije ${ticker}:`, error);
    throw error;
  }
};

export const fetchStock = async (ticker) => {
  try {
    const response = await apiTrading.get(`/stocks/${ticker}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching stock:", error);
    throw error;
  }
};
export const fetchForex = async (ticker) => {
  try {
    const response = await apiTrading.get(`/forex/${ticker}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching forex:", error);
    throw error;
  }
};

export const fetchFuture = async (ticker) => {
  try {
    const response = await apiTrading.get(`/future/${ticker}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching future:", error);
    throw error;
  }
};


export const fetchStockPriceByMonth = async (ticker) => {
  try {
    const response = await apiTrading.get(`/stocks/${ticker}/history`);
    return response.data.data;
  } catch (error) {
    console.error("Error while fetching stock price by month:", error);
    throw error;
  }
};

export const fetchStockPriceByDate = async (ticker, date) => {
  try {
    const response = await apiTrading.get(`/stocks/${ticker}/history/${date}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching stock price by date:", error);
    throw error;
  }
};

export const fetchFirstStockPrice = async (ticker) => {
  try {
    const response = await apiTrading.get(`/stocks/${ticker}/history/first`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching the first stock price:", error);
    throw error;
  }
};

export const fetchTaxData = async () => {
  try {
    const response = await apiTrading.get(`/tax`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tax data:", error);
    throw error;
  }
};

export const runTax = async () => {
  try {
    const response = await apiTrading.post("/tax/run");
    console.log("Tax calculation started:", response.data);
  } catch (error) {
    console.error("Error running tax calculation:", error);
    throw error;
  }
};

export default apiTrading;