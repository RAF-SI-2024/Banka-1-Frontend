import React from "react";
import { approveLoan } from "../../services/AxiosBanking";
import { toast } from "react-toastify";

const ApproveLoanButton = ({ loanId, onAction }) => {
    const handleApprove = async () => {
        try {
            const approvedLoan = {
                approved: true,
                reason: "Odobren"
            };

            await approveLoan(loanId, approvedLoan);
            toast.success(`Loan ${loanId} approved successfully.`);
            onAction?.();
        } catch (error) {
            toast.error(`Error approving loan ${loanId}: ${error.message}`);
            console.error(error);
        }
    };

    return (
        <button
            onClick={handleApprove}
            style={{
                backgroundColor: "green",
                color: "white",
                padding: "5px 10px",
                border: "none",
                cursor: "pointer"
            }}
        >
            Approve
        </button>
    );
};

export default ApproveLoanButton;