import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import {
    fetchAccountsTransactions
} from "../../services/AxiosBanking";

const AccountTransactionsList = ({ accountId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Define columns for the data grid displaying transactions
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "date", headerName: "Datum", width: 150 },
    { field: "amount", headerName: "Iznos", width: 130 },
    { field: "description", headerName: "Opis", width: 250 },
  ];

  // Format the date in the log to YYYY-MM-DD
  const formatLogDate = (log) => {
    if (typeof log !== "string" && typeof log !== "number") return String(log);
  
    const strLog = String(log);
    
    if (strLog.length === 8) {
      const year = strLog.slice(0, 4);
      const month = strLog.slice(4, 6);
      const day = strLog.slice(6, 8);
      
      return `${year}-${month}-${day}`;
    }
  
    return strLog;
    };

  /*useEffect hook to fetch transactions on accountId change*/
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {

        const response = await fetchAccountsTransactions(accountId);
        const data = response.data.transactions; 
        const formattedTransactions = data.map((transaction) => ({
          id: transaction.id,
          date: new Date(transaction.date).toLocaleString(),
          /*date: formatLogDate(transaction.date),*/ /*mozda treba ova da se iskoristi*/
          amount: transaction.amount,
          description: transaction.description,
        }));

        setTransactions(formattedTransactions);

      } catch (err) {
        setError("Error while fetching transactions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      loadTransactions(); 
    }
  }, [accountId]);

  if (loading) return <p>loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid 
        rows={transactions} 
        columns={columns} 
        pageSize={5} 
        rowsPerPageOptions={[5, 10]} 
      />
    </Paper>
  );
};

export default AccountTransactionsList;
