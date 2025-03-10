import React, { useState, useEffect } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import DataTable from "../../components/tables/DataTable";
import Button from "@mui/material/Button";
import LoanDetailsModal from "../../components/common/LoanDetailsModal";
import { fetchUserLoans } from "../../services/AxiosBanking";

const LoansPortal = () => {
    const [rows, setRows] = useState([]);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const columns = [
        { field: "loanName", headerName: "Loan Name", width: 200 },
        { field: "loanNumber", headerName: "Loan Number", width: 150 },
        { field: "remainingAmount", headerName: "Remaining Amount", width: 150 },
        {
            field: "details",
            headerName: "",
            width: 120,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenModal(params.row.loanNumber)}
                >
                    Details
                </Button>
            ),
        },
    ];

    const handleOpenModal = (loanId) => {
        setSelectedLoanId(loanId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedLoanId(null);
    };
/*
    useEffect(() => {
        const loadLoans = async () => {
            try {
                const response = await fetchUserLoans();
                if (response?.data?.loans) {
                    const formattedLoans = response.data.loans.map((loan) => ({
                        loanName: loan.loanType,
                        loanNumber: loan.id,
                        remainingAmount: loan.remainingAmount,
                    }));
                    setRows(formattedLoans);
                }
            } catch (error) {
                console.error("Error loading loans:", error);
            }
        };

        loadLoans();
    }, []);
*/

    // Simulirani podaci umesto fetchUserLoans
    const testLoans = [
        {
            id: 1,
            loanType: "CASH",
            loanAmount: 500000,
            duration: 24,
            nominalRate: 5.5,
            effectiveRate: 6.0,
            createdDate: 1741545198899,
            allowedDate: 1742149998899,
            monthlyPayment: 22000.0,
            nextPaymentDate: 1744137198899,
            remainingAmount: 500000.0,
            currencyType: "RSD",
        },
        {
            id: 2,
            loanType: "CAR LOAN",
            loanAmount: 800000,
            duration: 36,
            nominalRate: 4.2,
            effectiveRate: 4.8,
            createdDate: 1700000000000,
            allowedDate: 1750000000000,
            monthlyPayment: 30000.0,
            nextPaymentDate: 1746000000000,
            remainingAmount: 600000.0,
            currencyType: "EUR",
        },
    ];

    // Zakomentariši backend poziv i koristi test podatke
    useEffect(() => {
        setRows(
            testLoans.map((loan) => ({
                loanName: loan.loanType, // Loan Type -> Loan Name
                loanNumber: loan.id, // ID -> Loan Number
                remainingAmount: loan.remainingAmount, // Remaining Amount umesto Total Amount
                ...loan, // Dodaj sve ostale vrednosti za modal
            }))
        );
    }, []);

    //do ovde
    return (
        <div className="flex">
            <Sidebar />
            <div style={{ padding: "20px", marginTop: "64px", width: "100%", textAlign: "left", fontSize: 20 }}>
                <h2>Loans Overview</h2>

                {/*test dugme*/}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenModal(1)} // Test dugme otvara modal sa Loan ID = 1
                    style={{ marginBottom: "20px" }}
                >
                    Open Test Loan Modal
                </Button>
                {/*do ovde*/}

                <DataTable rows={rows} columns={columns} checkboxSelection={false} />
            </div>

            {/* Modal sa detaljima kredita */}
            <LoanDetailsModal open={modalOpen} onClose={handleCloseModal} loanId={selectedLoanId} />
        </div>
    );
};

export default LoansPortal;
