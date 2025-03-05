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
export const fetchTransactionsByAccountId = async (accountId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/account/${accountId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        // Mapiramo odgovor da format ostane isti kao ranije
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
        console.error(`Error fetching transactions for account ${accountId}:`, error);
        return [];
    }
};


/**
 * Fetchuje sve osobe za brzo plaćanje za trenutno prijavljenog korisnika.
 * Ako API ne radi, vraća prazan niz.
 */
export const getFastPaymentPersons = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return [];

    try {
        const response = await axios.get(`accounts/fastpayment/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        return response.data.map((person) => ({
            id: person.id,
            name: person.name,
            accountNumber: person.accountNumber
        }));
    } catch (error) {
        console.error("Error fetching fast payment persons:", error);
        return [];
    }
};

/**
 * Dodaje novu osobu za brzo plaćanje.
 */
export const addFastPaymentPerson = async (newRecipient) => {
    const userId = getUserIdFromToken();
    if (!userId) return [];

    try {
        const response = await axios.post(
            `/accounts/fastpayment/${userId}`,
            {
                name: newRecipient.name,
                accountNumber: newRecipient.accountNumber
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data; // Backend će vratiti kreiranog korisnika sa ID-jem
    } catch (error) {
        console.error("Error adding fast payment person:", error);
        throw error.response?.data?.message || "Failed to add recipient";
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
//Ovako igleda dto za FAST PAYMENT
/*
{ id: 1, name: "Person 1", accountNumber: "123456" },
{ id: 2, name: "Person 2", accountNumber: "654321" },
{ id: 3, name: "Person 3", accountNumber: "789012" }

 */



