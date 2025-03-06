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
import {createCustomer, fetchCustomers} from '../../services/AxiosUser';
import EditModal from '../common/EditModal';
import {toast} from "react-toastify";
import {createAccount} from "../../services/AxiosBanking";


const NewCurrentAccountModal = ({ open, onClose, accountType }) => {
    const [customers, setCustomers] = useState([]);
    const [makeCard, setMakeCard] = useState(false);
    const [startingBalance, setStartingBalance] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOwnerId, setSelectedOwnerId] = useState('');

    // Logic is the same as creating a user in CustomerPortal
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

    // Loading customer is the same as in CustomerPortal
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

    // Handling the Confirm button on the NewCurrentAccountModal screen
    const handleConfirm = async () => {

        // This is what is sent to the backend
        const accountData = {
            ownerID: selectedOwnerId,
            currency: "RSD",
            type: 'CURRENT',
            subtype: accountType.toLocaleUpperCase(),
            dailyLimit: 0,
            monthlyLimit: 0,
            status: "ACTIVE",
            balance: parseFloat(startingBalance),
            createCard: makeCard
        };

        console.log(accountData);


        try {
            // Calls the POST createAccount in Axios
            await createAccount(accountData);
            onClose();
        } catch (error) {
            console.error('Error creating account:', error);
        }
    };


    // Creating the customer is the same as in CustomerPortal-u
    const handleCreateCustomer = async (customerData) => {
        try {
            const customerPayload = {
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                username: customerData.username,
                birthDate: transformDateForApi(customerData.birthDate),
                gender: customerData.gender,
                email: customerData.email,
                phoneNumber: customerData.phoneNumber,
                address: customerData.address,
                accountInfo: {
                    currency: "RSD",
                    type: "CURRENT",
                    subtype: accountType.toUpperCase(),
                    dailyLimit: 0,
                    monthlyLimit: 0,
                    status: "ACTIVE",
                    createCard: makeCard
                }
            };

            const response = await createCustomer(customerPayload);

            setIsCreateModalOpen(false);
            onClose();
            resetCustomerForm();
            toast.success('Customer created successfully');

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

    // Used from CustomerPortal
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

            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="customer-label" shrink>
                    Choose a customer
                </InputLabel>
                <Select
                    labelId="customer-label"
                    value={selectedOwnerId} // Using selectedOwnerId for storing the customer ID
                    onChange={(e) => setSelectedOwnerId(e.target.value)} // Saving the customer ID here
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

export default NewCurrentAccountModal;
