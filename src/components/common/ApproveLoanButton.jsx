import React from "react";
import {
    approveLoan
} from "../../services/AxiosBanking";

const ApproveLoanButton = ({ loanId, onAction }) => {
    const handleApprove = async () => {

        try {
            const approvedLoan = {
                approved: true,
                reason: "odobren"
              };

            await approveLoan(loanId, approvedLoan);
            alert(`Loan ${loanId} approved successfully.`);
            onAction();
        } catch (error) {
            alert(`Error approving loan ${loanId}: ${error.message}`);
        }
    };

    return (
        <button onClick={handleApprove} style={{ backgroundColor: "green", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>
            Approve
        </button>
    );
};

export default ApproveLoanButton;
