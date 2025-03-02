import React from 'react';
import { Button, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddButton = ({ onClick, label = "Add New" }) => {
  const theme = useTheme();
  
  return (
    <Button
      variant="contained"
      color="tertiary" 
      startIcon={<AddIcon />}
      onClick={onClick}
      sx={{
        height: '42px',
        marginLeft: '10px'
      }}
    >
      {label}
    </Button>
  );
};

export default AddButton;