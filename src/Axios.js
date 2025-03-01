import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        // Ensure proper token format
        config.headers.Authorization = `Bearer ${token.trim()}`;
        
        // For debugging - remove in production
        console.log(`${config.method.toUpperCase()} ${config.url} - Token: ${token.substring(0, 20)}...`);
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// API functions
export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/api/auth/login', { email, password });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const fetchCustomers = async () => {
    try {
        const response = await api.get('/api/users/search/customers');
        return response.data;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
};

export const fetchEmployees = async () => {
    try {
        const response = await api.get('/api/users/search/employees');
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
        const response = await api.post('/api/auth/logout');
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};


export default api;
