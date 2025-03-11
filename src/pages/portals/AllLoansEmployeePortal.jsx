import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Sidebar from "../../components/mainComponents/Sidebar";
import SearchDataTable from "../../components/tables/SearchDataTable";
import { toast } from "react-toastify";
import { fetchAllLoansForEmployees } from "../../services/AxiosBanking";


const AllLoansEmployeePortal = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: "loanType", headerName: "Loan Type", width: 150 },
        { field: "interestType", headerName: "Interest Type", width: 150 },
        { field: "contractDate", headerName: "Contract Date", width: 150 },
        { field: "repaymentPeriod", headerName: "Repayment Period", width: 150 },
        { field: "accountNumber", headerName: "Account Number", width: 200 },
        { field: "loanAmount", headerName: "Loan Amount", width: 150 },
        { field: "remainingDebt", headerName: "Remaining Debt", width: 150 },
        { field: "currency", headerName: "Currency", width: 100 },
        { field: "loanStatus", headerName: "Loan Status", width: 150 }
    ];

    useEffect(() => {
        loadLoans();
    }, []);

    const loadLoans = async () => {
        try {
            setLoading(true);
            const response = await fetchAllLoansForEmployees();

            const data = response.data;
            if (!data || !Array.isArray(data.loans)) {
                setLoans([]);
                return;
            }

            const formattedLoans = data.loans.map((loan) => ({
                id: loan.id || "N/A",
                accountNumber: loan.account?.accountNumber || "N/A",
                loanType: loan.loanType || "N/A",
                interestType: loan.interestType || "N/A",
                contractDate: loan.createdDate ? new Date(loan.createdDate).toLocaleDateString() : "N/A",
                repaymentPeriod: loan.duration || "N/A",
                loanAmount: loan.loanAmount || 0,
                remainingDebt: loan.remainingAmount || 0,
                currency: loan.currencyType || "N/A",
                loanStatus: loan.paymentStatus || "N/A",
            }));

            const sortedLoans = formattedLoans.sort((a, b) => {
                return a.accountNumber.localeCompare(b.accountNumber);
            });

            setLoans(sortedLoans);

        } catch (err) {
            console.error("Error loading loans:", err);
            setError("Failed to load loans data");
            toast.error("Failed to load loans data");
            setLoans([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Sidebar />
            <div style={{ padding: "20px", marginTop: "64px" }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Employee Loans
                </Typography>

                <SearchDataTable
                    rows={loans}
                    columns={columns}
                    checkboxSelection={false}
                    loading={loading}
                    error={error}
                />
            </div>
        </div>
    );
};

export default AllLoansEmployeePortal;
