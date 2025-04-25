import React, { useState, useEffect } from "react";
import { Button, TextField, MenuItem, Snackbar, Alert, CircularProgress } from "@mui/material";
import { fetchTaxData, runTax } from "../../services/AxiosTrading";
import { fetchCustomerById, fetchEmployeeById } from "../../services/AxiosUser";
import DataTable from "../tables/DataTable";

const TaxTrackingTable = () => {
    const [taxRecords, setTaxRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [firstNameFilter, setFirstNameFilter] = useState("");
    const [lastNameFilter, setLastNameFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    useEffect(() => {
        loadTaxData();
    }, []);

    const loadTaxData = async () => {
        try {
            const taxData = await fetchTaxData();
            const enrichedData = await Promise.all(
                taxData.map(async (tax) => {
                    const userData = tax.is_actuary
                        ? await fetchEmployeeById(tax.user_id)
                        : await fetchCustomerById(tax.user_id);

                    return {
                        id: tax.user_id,
                        firstName: userData.data.firstName,
                        lastName: userData.data.lastName,
                        type: tax.is_actuary ? "Actuary" : "Client",
                        taxAmount: tax.tax_amount,
                        isPaid: tax.is_paid
                    };
                })
            );

            setTaxRecords(enrichedData);
            setFilteredRecords(enrichedData);
        } catch (error) {
            console.error("Error loading tax data:", error);
        }
    };

    useEffect(() => {
        const filtered = taxRecords.filter((record) => {
            const matchesFirstName = firstNameFilter === "" || record.firstName.toLowerCase().includes(firstNameFilter.toLowerCase());
            const matchesLastName = lastNameFilter === "" || record.lastName.toLowerCase().includes(lastNameFilter.toLowerCase());
            const matchesType = typeFilter === "" || record.type.toLowerCase() === typeFilter.toLowerCase();
            return matchesFirstName && matchesLastName && matchesType;
        });
        setFilteredRecords(filtered);
    }, [firstNameFilter, lastNameFilter, typeFilter, taxRecords]);

    const columns = [
        { field: "firstName", headerName: "First Name", flex: 1 },
        { field: "lastName", headerName: "Last Name", flex: 1 },
        { field: "type", headerName: "User Type", flex: 1 },
        { field: "taxAmount", headerName: "Tax Amount (USD)", flex: 1, type: "number" },
        {
            field: "isPaid",
            headerName: "Paid",
            flex: 1,
            renderCell: (params) => (params.row.isPaid ? "Yes" : "No"),
        },
    ];

    const handleRunTax = async () => {
        setIsLoading(true);
        try {
            await runTax();
            setSnackbar({
                open: true,
                message: "Tax calculation started successfully",
                severity: "success"
            });
            // Refresh the data after successful tax calculation
            await loadTaxData();
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to start tax calculation",
                severity: "error"
            });
            console.error("Failed to start tax calculation:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <div style={{ width: "100%" }}>
            <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: "10px" }}>
                <TextField
                    label="First Name"
                    variant="outlined"
                    size="small"
                    value={firstNameFilter}
                    onChange={(e) => setFirstNameFilter(e.target.value)}
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    size="small"
                    value={lastNameFilter}
                    onChange={(e) => setLastNameFilter(e.target.value)}
                />
                <TextField
                    select
                    label="User Type"
                    variant="outlined"
                    size="small"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{ width: 160 }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Client">Client</MenuItem>
                    <MenuItem value="Actuary">Actuary</MenuItem>
                </TextField>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleRunTax}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {isLoading ? "Running..." : "Run Tax"}
                </Button>
            </div>

            <DataTable rows={filteredRecords} columns={columns} checkboxSelection={false} />

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default TaxTrackingTable;