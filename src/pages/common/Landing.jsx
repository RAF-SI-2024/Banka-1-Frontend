import React from 'react';
import { Box, Typography, Button, Container, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  //Animations for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  //Animations for individual elements
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Choose logo based on theme mode
  const logoSrc = theme.palette.mode === 'dark' 
    ? "/logo-removebg-preview.png" 
    : "/logo-removebg-invert.png";

  return (
    <Container maxWidth="sm">
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '70vh',
          justifyContent: 'center'
        }}
      >
        {/* Logo - now conditional based on theme */}
        <Box
          component={motion.div}
          variants={itemVariants}
          sx={{
            mb: 4,
            width: '80%',
            maxWidth: 300,
          }}
        >
          <img 
            src={logoSrc}
            alt="Banka Logo" 
            style={{ width: '100%', height: 'auto' }} 
          />
        </Box>

        {/* Welcome text inside a Paper container*/}
        <Paper 
          component={motion.div}
          variants={itemVariants}
          elevation={3} 
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(66, 66, 66, 0.7)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            width: '100%'
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight="500">
            Welcome to 1Bank
          </Typography>
          <Typography variant="body1" align="center" paragraph>
          Reliable. Agile. Forward-thinking.
          </Typography>
        </Paper>

        {/* Login button */}
        <Button
          component={motion.button}
          variants={itemVariants}
          variant="contained" 
          color="primary"
          size="large"
          onClick={() => navigate('/login')} //Navigate to login page
          sx={{
            py: 1.5,
            px: 4,
            fontSize: '1.1rem',
            borderRadius: 2,
          }}
        >
          Login to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default Landing;