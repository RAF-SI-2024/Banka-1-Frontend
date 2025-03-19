import axios from "axios";

const apiTrading = axios.create({
    baseURL: "http://localhost:3000/trading",
    headers: {
        "Content-Type": "application/json",
    },
});

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
        const response = await apiTrading.put(`/actuaries/${id}/limit`, { limit: newLimit });
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
        const response = await apiTrading.get(`/securities/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching securities for user ${userId}:`, error);
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

export default apiTrading;
