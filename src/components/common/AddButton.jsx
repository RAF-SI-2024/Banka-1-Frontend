import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddButton = ({ onClick, label = "Add New" }) => {
    return (
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onClick}
            sx={{
                height: '42px',
                marginLeft: '10px',
                backgroundColor: '#595992',
                color: '#fff',
                '&:hover': {
                    backgroundColor: '#4d4d80'
                }
            }}
        >
            {label}
        </Button>
    );
};

export default AddButton;