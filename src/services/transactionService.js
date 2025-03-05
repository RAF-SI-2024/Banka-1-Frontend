import axios from "axios";
import { jwtDecode } from "jwt-decode";

// API BASE URL - promeni ako backend ima drugi endpoint
const API_BASE_URL = "http://localhost:8080/api/transactions";

/**
 * Dohvata ID korisnika iz JWT tokena.
 */
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

/**
 * Fetchuje sve transakcije za trenutno prijavljenog korisnika sa backend-a.
 * Ako API ne radi, vraća prazan niz.
 */
export const fetchTransactions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        // Mapiramo odgovor tako da format ostane isti kao ranije
        return response.data.map((t) => ({
            id: t.id,
            sender: t.sender,
            senderAccount: t.senderAccount,
            receiver: t.receiver,
            receiverAccount: t.receiverAccount,
            amount: t.amount,
            currency: t.currency,
            status: t.status,
            date: new Date(t.timestamp).toLocaleDateString(),
            time: new Date(t.timestamp).toLocaleTimeString(),
            paymentPurpose: t.description,
            paymentCode: t.paymentCode,
            referenceNumber: t.referenceNumber
        }));
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
};

/**
 * Fetchuje detalje o pojedinačnoj transakciji na osnovu ID-a.
 */
export const fetchTransactionDetails = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        // Mapiramo odgovor u isti format kao ranije
        const transaction = response.data;
        return {
            id: transaction.id,
            sender: transaction.sender,
            senderAccount: transaction.senderAccount,
            receiver: transaction.receiver,
            receiverAccount: transaction.receiverAccount,
            amount: transaction.amount,
            currency: transaction.currency,
            status: transaction.status,
            date: new Date(transaction.timestamp).toLocaleDateString(),
            time: new Date(transaction.timestamp).toLocaleTimeString(),
            paymentPurpose: transaction.description,
            paymentCode: transaction.paymentCode,
            referenceNumber: transaction.referenceNumber
        };
    } catch (error) {
        console.error(`Error fetching transaction with ID ${id}:`, error);
        return null;
    }
};

// OVAKO TREBA DA IZGELDA DTO DA BI MOGLO IME DA IDE U DETALJE.
/**]\[
 {
 "id": 1,
 "sender": "Marko Marković",
 "senderAccount": "205-123456789-01",
 "receiver": "Petar Petrović",
 "receiverAccount": "160-987654321-02",
 "amount": 100.00,
 "currency": "RSD",
 "status": "COMPLETED",
 "timestamp": "2025-03-01T14:35:00Z",
 "description": "Money Transfer",
 "paymentCode": "289",
 "referenceNumber": "12345678"
 },
 {
 "id": 2,
 "sender": "Jovan Jovanović",
 "senderAccount": "205-999988877-01",
 "receiver": "Ana Anić",
 "receiverAccount": "160-555566667-02",
 "amount": 250.00,
 "currency": "EUR",
 "status": "PENDING",
 "timestamp": "2025-03-02T09:15:00Z",
 "description": "Freelance Payment",
 "paymentCode": "333",
 "referenceNumber": "98765432"
 }
 ]
 */

