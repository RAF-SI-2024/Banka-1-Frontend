import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// This component is a card that displays a title, an icon, and children components
// It is used to display the login and signup forms
const AuthCard = ({ 
  title, 
  icon, 
  iconColor = 'secondary.main', 
  children 
}) => {
  return (
    <Card elevation={3} sx={{ width: '100%', borderRadius: 2 }}>
      <CardContent sx={{ padding: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: iconColor }}>
            {icon}
          </Avatar>
          <Typography component="h1" variant="h5">
            {title}
          </Typography>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AuthCard;