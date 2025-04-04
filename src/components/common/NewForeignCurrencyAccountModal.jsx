import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, FormControl, InputLabel, Select, MenuItem,
    Checkbox, FormControlLabel, TextField, Typography, RadioGroup, Radio
} from '@mui/material';
import { createCustomer, fetchCustomers } from '../../services/AxiosUser';
import {createAccount, getCompanies} from '../../services/AxiosBanking';
import EditModal from './EditModal';
import { toast } from 'react-toastify';
import {useNavigate} from "react-router-dom";

const NewForeignCurrencyAccountModal = ({ open, onClose, accountType, onSuccess }) => {
    const [customers, setCustomers] = useState([]);
    const [makeCard, setMakeCard] = useState(false);
    const [startingBalance, setStartingBalance] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOwnerId, setSelectedOwnerId] = useState('');
    const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const currencies = ['EUR', 'CHF', 'USD', 'GBP', 'JPY', 'CAD', 'AUD'];

    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const navigate = useNavigate();

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

    const [newCompany, setNewCompany] = useState({
        name: '',
        companyRegistrationNumber: '',
        activityCode: '',
        pib: '',
        address: ''
    });

    const createCompanyFormFields = [
        { name: 'name', label: 'Name', required: true },
        { name: 'companyRegistrationNumber', label: 'Registration Number', required: true },
        { name: 'pib', label: 'PIB', required: true },
        { name: 'address', label: 'Address', required: true },
        { name: 'activityCode', label: 'Activity Code', type: 'select', required: true, options: [
            { value: 1.11, label: 'Cultivation of cereals and legumes (1.11)' },
            { value: 1.13, label: 'Vegetable growing (1.13)' },
            { value: 13.1, label: 'Preparation and spinning of textile fibers (13.1)' },
            { value: 24.1, label: 'Manufacture of iron and steel (24.1)' },
            { value: 24.2, label: 'Production of steel pipes and fittings (24.2)' },
            { value: 41.1, label: 'Construction project development (41.1)' },
            { value: 41.2, label: 'Construction of buildings (41.2)' },
            { value: 42.11, label: 'Road and highway construction (42.11)' },
            { value: 42.12, label: 'Railroad and subway construction (42.12)' },
            { value: 42.13, label: 'Bridge and tunnel construction (42.13)' },
            { value: 42.21, label: 'Construction of utility projects for fluids (42.21)' },
            { value: 42.22, label: 'Construction of utility projects for electricity and telecommunications (42.22)' },
            { value: 5.1, label: 'Mining of hard coal (5.1)' },
            { value: 7.1, label: 'Mining of iron ores (7.1)' },
            { value: 7.21, label: 'Mining of uranium and thorium ores (7.21)' },
            { value: 8.11, label: 'Quarrying of ornamental and building stone (8.11)' },
            { value: 8.92, label: 'Extraction of peat (8.92)' },
            { value: 47.11, label: 'Retail sale in non-specialized stores (47.11)' },
            { value: 56.1, label: 'Restaurants and mobile food service activities (56.1)' },
            { value: 62.01, label: 'Computer programming activities (62.01)' },
            { value: 62.09, label: 'Other information technology and computer service activities (62.09)' },
            { value: 63.11, label: 'Data processing, hosting and related activities (63.11)' },
            { value: 64.19, label: 'Other monetary intermediation (64.19)' },
            { value: 64.91, label: 'Financial leasing (64.91)' },
            { value: 64.2, label: 'Activities of holding companies (64.2)' },
            { value: 66.3, label: 'Fund management activities (66.3)' },
            { value: 65.2, label: 'Reinsurance (65.2)' },
            { value: 65.11, label: 'Life insurance (65.11)' },
            { value: 65.12, label: 'Non-life insurance (65.12)' },
            { value: 66.21, label: 'Risk and damage evaluation (66.21)' },
            { value: 68.1, label: 'Buying and selling of own real estate (68.1)' },
            { value: 68.2, label: 'Renting and operating of own or leased real estate (68.2)' },
            { value: 53.1, label: 'Postal activities under universal service obligation (53.1)' },
            { value: 53.2, label: 'Other postal and courier activities (53.2)' },
            { value: 85.1, label: 'Pre-primary education (85.1)' },
            { value: 85.2, label: 'Primary education (85.2)' },
            { value: 86.1, label: 'Hospital activities (86.1)' },
            { value: 86.21, label: 'General medical practice activities (86.21)' },
            { value: 86.22, label: 'Specialist medical practice activities (86.22)' },
            { value: 86.9, label: 'Other human health activities (86.9)' },
            { value: 84.12, label: 'Regulation of the activities of providing health care, education, cultural services and other social services (84.12)' },
            { value: 90.01, label: 'Performing arts (90.01)' },
            { value: 90.02, label: 'Support activities to performing arts (90.02)' },
            { value: 90.04, label: 'Operation of arts facilities (90.04)' },
            { value: 93.11, label: 'Operation of sports facilities (93.11)' },
            { value: 93.13, label: 'Fitness facilities (93.13)' },
            { value: 93.19, label: 'Other sports activities (93.19)' },
            { value: 26.11, label: 'Manufacture of electronic components (26.11)' },
            { value: 27.12, label: 'Manufacture of electricity distribution and control apparatus (27.12)' },
            { value: 29.1, label: 'Manufacture of motor vehicles (29.1)' }
        ]}
    ];

    useEffect(() => {
        loadCustomers();
        loadCompanies();
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

    const loadCompanies = async () => {
            try {
                const data = await getCompanies();
                console.log("Companies data:", data.data);
                setCompanies(data?.data.companies || []);
            } catch (error) {
                console.error("Failed to load companies:", error);
            }
        };

    useEffect(() => {
        if (accountType === 'business') {
            console.log("Business account type selected, setting makeCard to true");
            setMakeCard(true);
        }
    }, [accountType]);
    
    useEffect(() => {
        if (accountType === 'business' && selectedOwnerId) {
            console.log("Filtering companies for owner ID:", selectedOwnerId);
            console.log("All companies:", companies);
            const filtered = companies.filter(c => c.ownerID === Number(selectedOwnerId));
            console.log("Filtered companies:", filtered);
            setFilteredCompanies(filtered);
        } else {
            setFilteredCompanies([]);
        }
    }, [selectedOwnerId, companies, accountType]);

    const handleConfirm = async () => {
        const isNewCustomer = !selectedOwnerId;

        if (accountType === 'business') {
            console.log("Business account type selected, setting makeCard to true");
            setMakeCard(true);
        }
        console.log("making a card", makeCard);

        if (!startingBalance || (isNewCustomer && !newCustomer.username)) return;

        try {
            let createdCustomerId = selectedOwnerId;

            if (isNewCustomer) {
                console.log("Creating new customer:", newCustomer);
                const customerPayload = {
                    ...newCustomer,
                    birthDate: transformDateForApi(newCustomer.birthDate),
                    accountInfo: {
                        currency: selectedCurrency.toUpperCase(),
                        type: "FOREIGN_CURRENCY",
                        subtype: accountType.toUpperCase(),
                        dailyLimit: 0,
                        monthlyLimit: 0,
                        status: "ACTIVE",
                        createCard: makeCard,
                        balance: parseFloat(startingBalance),
                        companyData: accountType === 'business' ? {
                            name: newCompany.name,
                            address: newCompany.address,
                            vatNumber: newCompany.pib,
                            companyNumber: newCompany.companyRegistrationNumber,
                            bas: newCompany.activityCode.toString(),
                        } : ''
                    }
                };

                const response = await createCustomer(customerPayload);
                createdCustomerId = response?.data?.customer?.id || response?.customer?.id;

                if (!createdCustomerId) {
                    toast.error("Customer was created, but ID was not returned.");
                    return;
                }
            }else if (selectedOwnerId){
                const accountData = {
                    ownerID: createdCustomerId,
                    currency: selectedCurrency.toUpperCase(),
                    type: 'FOREIGN_CURRENCY',
                    subtype: accountType.toUpperCase(),
                    dailyLimit: 0,
                    monthlyLimit: 0,
                    status: "ACTIVE",
                    createCard: makeCard,
                    balance: parseFloat(startingBalance),
                    companyID: null
                };
    
                if (accountType === 'business') {
                    if (selectedCompanyId) {
                        accountData.companyData = filteredCompanies.find(c => c.id === Number(selectedCompanyId))
                    }else{
                        accountData.companyData = {
                            name: newCompany.name,
                            address: newCompany.address,
                            vatNumber: newCompany.pib,
                            companyNumber: newCompany.companyRegistrationNumber,
                            bas: newCompany.activityCode.toString(),
                        };
                    }
                }
    
                await createAccount(accountData);
                toast.success("Customer and account created successfully!");
            }

           

            setSelectedOwnerId('');
            setStartingBalance('');
            setNewCustomer({
                firstName: '',
                lastName: '',
                username: '',
                birthDate: '',
                gender: '',
                email: '',
                phoneNumber: '',
                address: ''
            });
            setNewCompany({
                name: '',
                companyRegistrationNumber: '',
                activityCode: '',
                pib: '',
                address: ''
            });
            setMakeCard(false);
            onClose();
            onSuccess?.();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error creating account or customer.");
        }
    };

    const transformDateForApi = (dateString) => {
        if (!dateString) return null;
        try {
            const [year, month, day] = dateString.split('-');
            return `${day}-${month}-${year}`;
        } catch (error) {
            console.error('Error converting date:', error);
            return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Creating a {accountType} current account</DialogTitle>
            <DialogContent>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={accountType === "business" ? true : makeCard}
                            onChange={(e) => {
                                if (accountType !== "business") {
                                    setMakeCard(e.target.checked);
                                }
                            }}
                            disabled={accountType === "business"}
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
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="customer-label">Choose a customer</InputLabel>
                    <Select
                        labelId="customer-label"
                        value={selectedOwnerId}
                        onChange={(e) => setSelectedOwnerId(e.target.value)}
                    >
                        <MenuItem value="">Choose a customer</MenuItem>
                        {customers.map((customer) => (
                            <MenuItem key={customer.id} value={customer.id}>
                                {customer.firstName} {customer.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                 {accountType === 'business' && filteredCompanies.length > 0 && (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="company-select">Select Company</InputLabel>
                        <Select
                            labelId="company-select"
                            value={selectedCompanyId}
                            onChange={(e) => setSelectedCompanyId(e.target.value)}
                        >
                            {filteredCompanies.map(company => (
                                <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Create New Customer
                </Button>

                <EditModal
                    open={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    data={newCustomer}
                    formFields={[
                        { name: 'firstName', label: 'First Name', required: true },
                        { name: 'lastName', label: 'Last Name', required: true },
                        { name: 'username', label: 'Username', required: true },
                        { name: 'email', label: 'Email', type: 'email', required: true },
                        { name: 'phoneNumber', label: 'Phone Number' },
                        { name: 'address', label: 'Address' },
                        { name: 'birthDate', label: 'Birth Date', type: 'date' },
                        { name: 'gender', label: 'Gender', type: 'select', options: [
                            { value: 'MALE', label: 'Male' },
                            { value: 'FEMALE', label: 'Female' },
                            { value: 'OTHER', label: 'Other' },
                        ]},
                    ]}
                    onSave={(data) => {
                        setNewCustomer(data);
                        setIsCreateModalOpen(false);
                    }}
                    title="Create New Customer"
                />

                {accountType === 'business' && (
                    <>
                        <Button
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={() => setIsCreateCompanyModalOpen(true)}
                        >
                            Enter Company Info
                        </Button>

                        <EditModal
                            open={isCreateCompanyModalOpen}
                            onClose={() => setIsCreateCompanyModalOpen(false)}
                            data={newCompany}
                            formFields={createCompanyFormFields}
                            onSave={(updatedData) => {
                                setNewCompany(updatedData);
                                setIsCreateCompanyModalOpen(false);
                                toast.success('Company data saved.');
                            }}
                            title="Enter Company Data"
                        />
                    </>
                )}

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default NewForeignCurrencyAccountModal;