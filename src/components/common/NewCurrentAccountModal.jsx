import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, FormControl, InputLabel, Select, MenuItem,
    Checkbox, FormControlLabel, TextField
} from '@mui/material';
import { createCustomer, fetchCustomers } from '../../services/AxiosUser';
import EditModal from '../common/EditModal';
import { toast } from "react-toastify";
import { createAccount } from "../../services/AxiosBanking";

const NewCurrentAccountModal = ({ open, onClose, accountType, onSuccess }) => {
    const [customers, setCustomers] = useState([]);
    const [makeCard, setMakeCard] = useState(false);
    const [startingBalance, setStartingBalance] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOwnerId, setSelectedOwnerId] = useState('');

    const [newCustomer, setNewCustomer] = useState({
        firstName: '',
        lastName: '',
        username: '',
        birthDate: '',
        gender: '',
        email: '',
        phoneNumber: '',
        address: ''
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await fetchCustomers();
            const rowData = data?.data?.rows || [];
            const formattedCustomers = rowData.map((row) => ({
                id: row.id,
                firstName: row.firstName,
                lastName: row.lastName
            }));
            setCustomers(formattedCustomers);
        } catch (error) {
            console.error("Failed to load customers data:", error);
        }
    };

    const handleConfirm = async () => {
        const accountData = {
            ownerID: selectedOwnerId,
            currency: "RSD",
            type: 'CURRENT',
            subtype: accountType.toUpperCase(),
            dailyLimit: 0,
            monthlyLimit: 0,
            status: "ACTIVE",
            createCard: makeCard,
            balance: parseFloat(startingBalance),
        };

        try {
            await createAccount(accountData);
            onClose();
            onSuccess?.();
        } catch (error) {
            console.error('Error creating account:', error);
            toast.error('Error creating account.');
        }
    };

    const handleCreateCustomer = async (customerData) => {
        try {
            const customerPayload = {
                ...customerData,
                birthDate: transformDateForApi(customerData.birthDate),
                accountInfo: {
                    currency: "RSD",
                    type: "CURRENT",
                    subtype: accountType.toUpperCase(),
                    dailyLimit: 0,
                    monthlyLimit: 0,
                    status: "ACTIVE",
                    createCard: makeCard,
                    balance: parseFloat(startingBalance),
                }
            };

            await createCustomer(customerPayload);
            setIsCreateModalOpen(false);
            onClose();
            resetCustomerForm();
            toast.success('Customer created successfully');
            onSuccess?.();

        } catch (error) {
            toast.error(`Failed to create customer: ${error.message}`);
        }
    };

    const resetCustomerForm = () => {
        setNewCustomer({
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            phoneNumber: "",
            address: "",
            birthDate: "",
            gender: ""
        });
    };

    const transformDateForApi = (dateString) => {
        if (!dateString) return null;
        try {
            const [year, month, day] = dateString.split('-'); // ISO format (yyyy-mm-dd)
            return `${day}-${month}-${year}`; // expected format
        } catch (error) {
            console.error('Error converting date:', error);
            return null;
        }
    };

    const customerFormFields = [
        { name: 'firstName', label: 'First Name', required: true },
        { name: 'lastName', label: 'Last Name', required: true },
        { name: 'username', label: 'Username', required: true },
        { name: 'email', label: 'Email', required: true, type: 'email' },
        { name: 'phoneNumber', label: 'Phone Number' },
        { name: 'address', label: 'Address' },
        { name: 'birthDate', label: 'Birth Date', type: 'date' },
        {
            name: 'gender', label: 'Gender', type: 'select', options: [
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
                { value: 'OTHER', label: 'Other' }
            ]
        }
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Creating a {accountType} current account</DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={makeCard}
                            onChange={(e) => setMakeCard(e.target.checked)}
                        />
                    }
                    label="Make a card"
                    sx={{ mt: 2 }}
                />

                <TextField
                    fullWidth
                    label="Starting Balance"
                    type="number"
                    value={startingBalance}
                    onChange={(e) => setStartingBalance(e.target.value)}
                    sx={{ mt: 2 }}
                />
            </DialogContent>

            <FormControl fullWidth sx={{ mt: 2, px: 3 }}>
                <InputLabel id="customer-label" shrink>
                    Choose a customer
                </InputLabel>
                <Select
                    labelId="customer-label"
                    value={selectedOwnerId}
                    onChange={(e) => setSelectedOwnerId(e.target.value)}
                    displayEmpty
                    label="Choose a customer"
                >
                    <MenuItem value="" disabled>Choose a customer</MenuItem>
                    {customers.map((customer) => (
                        <MenuItem key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button
                variant="outlined"
                sx={{ mt: 2, width: '90%', ml: 3 }}
                onClick={() => setIsCreateModalOpen(true)}
            >
                Create New Customer
            </Button>

            <DialogActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={!selectedOwnerId || !startingBalance}
                >
                    Confirm
                </Button>
            </DialogActions>

            <EditModal
                open={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    resetCustomerForm();
                }}
                data={newCustomer}
                formFields={customerFormFields}
                onSave={handleCreateCustomer}
                title="Create New Customer"
            />
        </Dialog>
    );
};

export default NewCurrentAccountModal;