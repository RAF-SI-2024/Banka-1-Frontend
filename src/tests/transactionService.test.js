import { fetchTransactions, fetchTransactionDetails } from "../services/transactionService";
import { jwtDecode } from "jwt-decode";

jest.mock("jwt-decode", () => ({
    jwtDecode: jest.fn(),
}));

describe("Transaction Service", () => {
    beforeEach(() => {
        localStorage.setItem("token", "mockToken");

        jwtDecode.mockReturnValue({ id: 1 });
    });

    afterEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test("fetchTransactions should return filtered transactions for logged-in user", async () => {
        const transactions = await fetchTransactions();

        expect(transactions).toBeDefined();
        expect(transactions.length).toBeGreaterThan(0);

        transactions.forEach(transaction => {
            expect(transaction).toHaveProperty("sender");
            expect(transaction).toHaveProperty("receiver");
            expect(transaction).toHaveProperty("amount");
            expect(transaction).toHaveProperty("currency");
            expect(transaction).toHaveProperty("status");
        });
    });

    test("fetchTransactionDetails should return transaction details", async () => {
        const transaction = await fetchTransactionDetails(1);

        expect(transaction).toBeDefined();
        expect(transaction.id).toBe(1);
        expect(transaction.sender).toBe("Marko Marković");
        expect(transaction.receiver).toBe("Petar Petrović");
        expect(transaction.amount).toBe(100);
        expect(transaction.currency).toBe("RSD");
    });
});