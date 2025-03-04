import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import {createAccount, createCustomer, fetchCustomers} from '../../services/Axios';
import EditModal from '../common/EditModal';
import {toast} from "react-toastify";
import {Radio, RadioGroup, Typography} from "@mui/material"; // Assuming this is the create form component

const NewForeignCurrencyAccountModal = ({ open, onClose, accountType }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [makeCard, setMakeCard] = useState(false);
    const [startingBalance, setStartingBalance] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOwnerId, setSelectedOwnerId] = useState(''); // Track the selected ownerId
    const [selectedCurrency, setSelectedCurrency] = useState('');


    const currencies = ['EUR', 'CHF', 'USD', 'GBP', 'JPY', 'CAD', 'AUD'];

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
            currency: selectedCurrency,
            type: 'FOREIGN_CURRENCY',
            subtype: accountType.toLocaleUpperCase(),
            dailyLimit: 0,
            monthlyLimit: 0,
            status: "ACTIVE",
            balance: parseFloat(startingBalance)
        };

        console.log("Account Data:", accountData);

        try {
            await createAccount(accountData);
            onClose();
        } catch (error) {
            console.error('Error creating account:', error);
        }
    };

    const handleCreateCustomer = async (customerData) => {
        try {
            const customerPayload = {
                ime: customerData.firstName,
                prezime: customerData.lastName,
                username: customerData.username,
                datum_rodjenja: transformDateForApi(customerData.birthDate),
                pol: customerData.gender,
                email: customerData.email,
                broj_telefona: customerData.phoneNumber,
                adresa: customerData.address,
            };

            const response = await createCustomer(customerPayload);
            const createdCustomer = response.data;

            setIsCreateModalOpen(false);
            resetCustomerForm();
            toast.success('Customer created successfully');

            await loadCustomers();

            setSelectedCustomer({
                id: createdCustomer.id,
                firstName: createdCustomer.firstName,
                lastName: createdCustomer.lastName,
                email: createdCustomer.email,
                phoneNumber: createdCustomer.phoneNumber
            });

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
            gender: "",
            // password: ""
        });
    };

    const transformDateForApi = (dateString) => {
        // Skip if empty
        if (!dateString) return null;

        try {
            // Expecting "DD-MM-YYYY" => split by '-'
            const [day, month, year] = dateString.split('-');

            // Validate we got three parts
            if (!day || !month || !year) return null;

            // Construct "YYYYMMDD" and parse it as a number
            const resultString = `${year}${month}${day}`; // "20020302"

            // Optionally add further checks for valid day/month/year ranges
            return Number(resultString);

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
        { name: 'gender', label: 'Gender', type: 'select', options: [
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
                { value: 'OTHER', label: 'Other' }
            ] }
    ];

    const createCustomerFormFields = [
        ...customerFormFields,
        // { name: 'password', label: 'Password', type: 'password', required: true }
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Creating a {accountType} foreign currency account</DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mt: 2 }}>
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
                    sx={{ mt: 2, width: '100%' }}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Create New Customer
                </Button>

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Choose Currency
                </Typography>
                <RadioGroup
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}
                >
                    {currencies.map((currency) => (
                        <FormControlLabel
                            key={currency}
                            value={currency}
                            control={<Radio />}
                            label={currency}
                        />
                    ))}
                </RadioGroup>

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

            <DialogActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={() => {handleConfirm()}}
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
                formFields={createCustomerFormFields}
                onSave={handleCreateCustomer}
                title="Create New Customer"
            />
        </Dialog>
    );
};

export default NewForeignCurrencyAccountModal;
