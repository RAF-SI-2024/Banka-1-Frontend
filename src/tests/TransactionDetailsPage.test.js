import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TransactionDetailsPage from "../pages/transactions/TransactionDetailsPage";
import { fetchTransactionDetails } from "../services/transactionService";
import userEvent from "@testing-library/user-event";

jest.mock("../services/transactionService", () => ({
    fetchTransactionDetails: jest.fn(),
}));

describe("TransactionDetailsPage", () => {
    beforeEach(() => {
        fetchTransactionDetails.mockClear();
    });

    test("displays all transaction details", async () => {
        const mockTransaction = {
            id: 1,
            sender: "Marko Marković",
            senderAccount: "205-123456789-01",
            receiver: "Petar Petrović",
            receiverAccount: "160-987654321-02",
            paymentPurpose: "Payment for services",
            amount: 100,
            currency: "RSD",
            paymentCode: "289",
            referenceNumber: "12345678",
            date: "01/03/2025",
            time: "14:35",
        };

        fetchTransactionDetails.mockResolvedValue(mockTransaction);

        render(
            <MemoryRouter
                initialEntries={["/transaction/1"]}
                future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
                <Routes>
                    <Route path="/transaction/:id" element={<TransactionDetailsPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(fetchTransactionDetails).toHaveBeenCalledWith("1");
        });

        // Using getByLabelText or getAllByText for more precise queries
        expect(screen.getByLabelText("Transaction ID")).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockTransaction.id.toString())).toBeInTheDocument();

        expect(screen.getByLabelText("Sender Name")).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockTransaction.sender)).toBeInTheDocument();

        expect(screen.getByLabelText("Sender Account")).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockTransaction.senderAccount)).toBeInTheDocument();

        expect(screen.getByLabelText("Recipient Name")).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockTransaction.receiver)).toBeInTheDocument();

        expect(screen.getByLabelText("Recipient Account")).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockTransaction.receiverAccount)).toBeInTheDocument();

        expect(screen.getByLabelText("Payment Purpose")).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockTransaction.paymentPurpose)).toBeInTheDocument();

        expect(screen.getByLabelText("Amount")).toBeInTheDocument();
        expect(screen.getByDisplayValue(`${mockTransaction.amount} ${mockTransaction.currency}`)).toBeInTheDocument();

        expect(screen.getByLabelText("Payment Code")).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockTransaction.paymentCode)).toBeInTheDocument();

        expect(screen.getByLabelText("Reference Number")).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockTransaction.referenceNumber)).toBeInTheDocument();

        expect(screen.getByLabelText("Date & Time")).toBeInTheDocument();
        expect(screen.getByDisplayValue(`${mockTransaction.date} at ${mockTransaction.time}`)).toBeInTheDocument();
    });

    test("closes modal when close button is clicked", async () => {
        const mockTransaction = {
            id: 1,
            sender: "Marko Marković",
            senderAccount: "205-123456789-01",
            receiver: "Petar Petrović",
            receiverAccount: "160-987654321-02",
            paymentPurpose: "Payment for services",
            amount: 100,
            currency: "RSD",
            paymentCode: "289",
            referenceNumber: "12345678",
            date: "01/03/2025",
            time: "14:35",
        };

        fetchTransactionDetails.mockResolvedValue(mockTransaction);

        render(
            <MemoryRouter initialEntries={["/transaction/1"]}>
                <Routes>
                    <Route path="/transaction/:id" element={<TransactionDetailsPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Transaction Details")).toBeInTheDocument();
        });

        const closeButton = screen.getByRole("button", { name: /close/i });
        await userEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText("Transaction Details")).not.toBeInTheDocument();
        });
    });
});