import React from "react";
import {
    denyLoan
} from "../../services/AxiosBanking";

const DenyLoanButton = ({ loanId, onAction }) => {
    const handleDeny = async () => {
        try {
            
            const deniedLoan = {
                approved: false,
                reason: "obaljen"
              };

            await denyLoan(loanId, deniedLoan);
            alert(`Loan ${loanId} denied successfully.`);
            onAction(); 
        } catch (error) {
            alert(`Error denying loan ${loanId}: ${error.message}`);
        }
    };

    return (
        <button onClick={handleDeny} style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>
            Deny
        </button>
    );
};

export default DenyLoanButton;
