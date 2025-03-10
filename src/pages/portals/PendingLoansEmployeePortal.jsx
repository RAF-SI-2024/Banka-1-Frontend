import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Sidebar from "../../components/mainComponents/Sidebar";
import SearchDataTable from '../../components/tables/SearchDataTable';
import { toast } from "react-toastify";
import {fetchAllPendingLoans} from "../../services/AxiosBanking";
import ApproveLoanButton from "../../components/common/ApproveLoanButton";
import DenyLoanButton from "../../components/common/DenyLoanButton";

const PendingLoansEmployeePortal = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: "id", headerName: "Loan ID", width: 100 },
        { field: "loanType", headerName: "Loan Type", width: 150 },
        { field: "numberOfInstallments", headerName: "Number of Installments", width: 180 },
        { field: "currencyType", headerName: "Currency Type", width: 150 },
        { field: "interestType", headerName: "Interest Type", width: 150 },
        { field: "paymentStatus", headerName: "Payment Status", width: 150 },
        { field: "nominalRate", headerName: "Nominal Rate", width: 150 },
        { field: "effectiveRate", headerName: "Effective Rate", width: 150 },
        { field: "loanAmount", headerName: "Loan Amount", width: 150 },
        { field: "duration", headerName: "Duration (months)", width: 150 },
        { field: "createdDate", headerName: "Created Date", width: 180 },
        { field: "allowedDate", headerName: "Allowed Date", width: 180 },
        { field: "monthlyPayment", headerName: "Monthly Payment", width: 150 },
        { field: "nextPaymentDate", headerName: "Next Payment Date", width: 180 },
        { field: "remainingAmount", headerName: "Remaining Amount", width: 150 },
        { field: "loanReason", headerName: "Loan Reason", width: 200 },
        { field: "accountNumber", headerName: "Account Number", width: 200 },
        {
            field: "approve",
            headerName: "Approve",
            width: 120,
            renderCell: (params) => <ApproveLoanButton loanId={params.row.id} onAction={() => console.log("Loan Approved")} />
        },
        {
            field: "deny",
            headerName: "Deny",
            width: 120,
            renderCell: (params) => <DenyLoanButton loanId={params.row.id} onAction={() => console.log("Loan Denied")} />
        }
    ];
    

    useEffect(() => {
        loadLoans();
    }, []);

    const loadLoans = async () => {
        try {
            setLoading(true);
            const filteredLoans = await fetchAllPendingLoans();
            console.log(filteredLoans);
          

          /*  const formattedLoans = data.data.loans;
                data = loans.map(row => ({
                id: row.id,
                loanType: row.loanType,
                numberOfInstallments: row.numberOfInstallments,
                currencyType: row.currencyType,
                interestType: row.interestType,
                paymentStatus: row.paymentStatus,
                nominalRate: row.nominalRate,
                effectiveRate: row.effectiveRate,
                loanAmount: row.loanAmount,
                duration: row.duration,
                createdDate: new Date(row.createdDate).toLocaleDateString(),
                allowedDate: new Date(row.allowedDate).toLocaleDateString(),
                monthlyPayment: row.monthlyPayment,
                nextPaymentDate: new Date(row.nextPaymentDate).toLocaleDateString(),
                remainingAmount: row.remainingAmount,
                loanReason: row.loanReason,
                accountId: row.account.id
            }));*/

        const formattedLoans = filteredLoans.map(loan => ({
                id: loan.id,
                loanType: loan.loanType,
                numberOfInstallments: loan.numberOfInstallments ?? "N/A",
                currencyType: loan.currencyType,
                interestType: loan.interestType,
                paymentStatus: loan.paymentStatus,
                nominalRate: loan.nominalRate,
                effectiveRate: loan.effectiveRate,
                loanAmount: loan.loanAmount.toFixed(2),
                duration: loan.duration,
                createdDate: new Date(loan.createdDate).toLocaleDateString(),
                allowedDate: new Date(loan.allowedDate).toLocaleDateString(),
                monthlyPayment: loan.monthlyPayment.toFixed(2),
                nextPaymentDate: new Date(loan.nextPaymentDate).toLocaleDateString(),
                remainingAmount: loan.remainingAmount.toFixed(2),
                loanReason: loan.loanReason || "N/A",
                accountNumber: loan.account?.accountNumber ?? "N/A"
        }));
            
            setLoans(formattedLoans);
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
                    Pending Loans Overview
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

export default PendingLoansEmployeePortal;
