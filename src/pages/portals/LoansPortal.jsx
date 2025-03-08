import React, { useState } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import DataTable from "../../components/tables/DataTable";
import Button from "@mui/material/Button";
import LoanDetailsModal from "../../components/common/LoanDetailsModal";

const LoansPortal = () => {
    const [rows, setRows] = useState([]); // Trenutno nema podataka sa backenda
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const columns = [
        { field: "loanName", headerName: "Loan Name", width: 200 },
        { field: "loanNumber", headerName: "Loan Number", width: 150 },
        { field: "totalAmount", headerName: "Total Amount", width: 150 },
        {
            field: "details",
            headerName: "",
            width: 120,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenModal(params.row)}
                >
                    Details
                </Button>
            ),
        },
    ];

    const handleOpenModal = (loan) => {
        setSelectedLoan(loan);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedLoan(null);
    };

    // Test podaci za proveru modala
    const testLoanData = {
        loanNumber: "12345678",
        loanType: "Personal Loan",
        totalAmount: "10,000 USD",
        repaymentPeriod: "5 years",
        nominalInterestRate: "5%",
        effectiveInterestRate: "5.5%",
        contractDate: "2023-01-15",
        finalPaymentDate: "2028-01-15",
        nextInstallmentAmount: "200 USD",
        nextInstallmentDate: "2024-04-15",
        remainingDebt: "8,000 USD",
        currency: "USD",
    };

    return (
        <div className="flex">
            <Sidebar />
            <div style={{ padding: "20px", marginTop: "64px", width: "100%", textAlign: "left", fontSize: 20 }}>
                <h2>Loans Overview</h2>

                {/* Test dugme za otvaranje modala */}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenModal(testLoanData)}
                    style={{ marginBottom: "20px" }}
                >
                    Test Modal
                </Button>

                <DataTable rows={rows} columns={columns} checkboxSelection={false} />
            </div>

            {/* Modal za prikaz detalja kredita */}
            <LoanDetailsModal open={modalOpen} onClose={handleCloseModal} loan={selectedLoan} />
        </div>
    );
};

export default LoansPortal;
