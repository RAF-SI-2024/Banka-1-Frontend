import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const NewAccountModal = ({ open, onClose, onContinue }) => {
    const [account, setAccount] = useState('');
    const [accountType, setAccountType] = useState('');
    const [balance, setBalance] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isTypeFocused, setIsTypeFocused] = useState(false);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Creating a new account
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                    Choose the account you want to create
                </Typography>

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel
                        id="account-label"
                        shrink
                    >
                        Account
                    </InputLabel>
                    <Select
                        labelId="account-label"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        displayEmpty
                        label="Account"
                    >
                        <MenuItem value="" disabled>
                            Choose account
                        </MenuItem>
                        <MenuItem value="current">Current</MenuItem>
                        <MenuItem value="foreign">Foreign Currency</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogContent sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                    Choose the type of account you want to create
                </Typography>

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel
                        id="account-type-label"
                        shrink
                    >
                        Account type
                    </InputLabel>
                    <Select
                        labelId="account-type-label"
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        onFocus={() => setIsTypeFocused(true)}
                        onBlur={() => setIsTypeFocused(false)}
                        displayEmpty
                        label="Account type"
                    >
                        <MenuItem value="" disabled>
                            Choose account type
                        </MenuItem>
                        <MenuItem value="standard">Standard</MenuItem>
                        <MenuItem value="savings">Savings</MenuItem>
                        <MenuItem value="pension">Pension</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="youth">Youth</MenuItem>
                        <MenuItem value="personal">Personal</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (!account || !accountType) {
                            console.log("Please select both account and type");
                            return;
                        }
                        onContinue(account, accountType);
                    }}
                    disabled={!account || !accountType}
                >
                    Continue
                </Button>

            </DialogActions>
        </Dialog>
    );
};

export default NewAccountModal;
