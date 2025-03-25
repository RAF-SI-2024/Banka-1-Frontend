import React from "react";
import { denyLoan } from "../../services/AxiosBanking";
import { toast } from "react-toastify";

const DenyLoanButton = ({ loanId, onAction }) => {
    const handleDeny = async () => {
        try {
            const deniedLoan = {
                approved: false,
                reason: "Odbijen"
            };

            await denyLoan(loanId, deniedLoan);
            toast.success(`Loan ${loanId} denied successfully.`);
            onAction?.();
        } catch (error) {
            toast.error(`Error denying loan ${loanId}: ${error.message}`);
            console.error(error);
        }
    };

    return (
        <button
            onClick={handleDeny}
            style={{
                backgroundColor: "red",
                color: "white",
                padding: "5px 10px",
                border: "none",
                cursor: "pointer"
            }}
        >
            Deny
        </button>
    );
};

export default DenyLoanButton;