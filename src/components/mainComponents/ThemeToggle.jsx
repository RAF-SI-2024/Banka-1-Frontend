import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4'; 
import Brightness7Icon from '@mui/icons-material/Brightness7'; 
import { styled } from '@mui/material/styles';
import { useTheme } from '../../context/ThemeContext';

// This component is a floating button that toggles the theme
// It displays a sun icon for light mode and a moon icon for dark mode
// It is used to toggle the theme in the app
const FloatingButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  boxShadow: theme.shadows[4],
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
  },
  zIndex: 1300,
  width: 50,
  height: 50,
}));

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  
  return (
    <FloatingButton 
      onClick={toggleTheme} 
      color="inherit" 
      aria-label="toggle theme"
      size="large"
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </FloatingButton>
  );
};

export default ThemeToggle;