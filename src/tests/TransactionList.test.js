import { render, screen, waitFor } from "@testing-library/react";
import TransactionList from "../components/TransactionList";

describe("TransactionList Component", () => {
    test("renders receiver, status, and amount correctly", async () => {
        render(
            <TransactionList transactions={[
                {
                    id: 1,
                    receiver: "Petar Petrović",
                    status: "COMPLETED",
                    amount: 100,
                    currency: "RSD",
                },
            ]} />
        );

        await waitFor(() => {
            expect(screen.getByText("Petar Petrović")).toBeInTheDocument();
            expect(screen.getByText("COMPLETED")).toBeInTheDocument();
            expect(screen.getByText("100 RSD")).toBeInTheDocument();
        });
    });
});