import React, { useState, useEffect } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import DataTable from "../../components/tables/DataTable";
import Button from "@mui/material/Button";
import LoanDetailsModal from "../../components/common/LoanDetailsModal";
import { fetchUserLoans } from "../../services/AxiosBanking";
import LoanRequestModal from "../../components/common/LoanRequestModal";

const LoansPortal = () => {
    const [rows, setRows] = useState([]);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loanModalOpen, setLoanModalOpen] = useState(false);

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

    useEffect(() => {
        const loadLoans = async () => {
            try {
                const response = await fetchUserLoans();
                if (response?.data?.loans) {
                    const formattedLoans = response.data.loans.map((loan) => ({
                        id: loan.id,
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


    return (
        <div className="flex">
            <Sidebar />
            <div style={{ padding: "20px", marginTop: "64px", width: "100%", textAlign: "left", fontSize: 20 }}>
                <h2>Loans Overview</h2>

                <Button 
                    variant="contained"     
                    color="primary"          
                    onClick={() => setLoanModalOpen(true)}  
                >
                    Apply for loan
                </Button>
                <DataTable rows={rows} columns={columns} checkboxSelection={false} />
            </div>

            {/* Pop up with loan details */}
            <LoanDetailsModal open={modalOpen} onClose={handleCloseModal} loanId={selectedLoanId} />

            {/* Pop up za novi zahtev */}
            <LoanRequestModal open={loanModalOpen} onClose={() => setLoanModalOpen(false)} />

        </div>
    );
};

export default LoansPortal;
