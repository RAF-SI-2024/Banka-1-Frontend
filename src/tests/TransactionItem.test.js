import React from "react";
import { render, screen } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";
import TransactionItem from "../components/transactionTable/TransactionItem";

const mockTransaction = {
    id: 1,
    receiver: "Petar Petrović",
    sender: "Marko Marković",
    status: "COMPLETED",
    amount: 100,
    currency: "RSD",
};

describe("TransactionItem Component", () => {
    test("renders transaction details correctly", () => {
        render(
            <Table>
                <TableBody>
                    <TransactionItem transaction={mockTransaction} />
                </TableBody>
            </Table>
        );

        expect(screen.getByText("Petar Petrović")).toBeInTheDocument();
        expect(screen.getByText("COMPLETED")).toBeInTheDocument();
        expect(screen.getByText("100 RSD")).toBeInTheDocument();
    });
});