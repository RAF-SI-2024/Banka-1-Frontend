import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home'; // Added Home icon
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../common/LogoutButton';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

// Styling for the sidebar components using Emotion CSS-in-JS library
const drawerWidth = 240;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [canRead, setCanRead] = React.useState(true);
  const navigate = useNavigate();
  // Functions to open the sidebar
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  // Function to close the sidebar
  const handleDrawerClose = () => {
    setOpen(false);
  };


  const handleReadPermission = () =>{
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const position = decodedToken.position;
        if(position === "Nijedna"){
          setCanRead(false);
        }
      } catch (error) {
        console.error("Invalid token", error);
      }
    } else {
      console.log("No token found");
    }


  }
  useEffect(() => {
    handleReadPermission()
  }, []);



// Function to navigate to the selected page
const handleNavigation = (text) => {
  if (text === 'Home') {
    navigate('/home');
  } else if (text === 'Customer') {
    navigate('/customer-portal');
  } else if (text === 'Employees') {
    navigate('/employee-portal');
  } else if (text == 'Cards') {
    navigate('/cards');
  }
  setOpen(false);
};


  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}></Box>
         <LogoutButton/>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* Home button */}
          <ListItem key="home" disablePadding>
            <ListItemButton onClick={() => handleNavigation('Home')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          {/*Cards button */}
          <ListItem key="cards" disablePadding>
          <ListItemButton onClick={() => handleNavigation('Cards')}>
              <ListItemIcon>
                <InboxIcon /> 
              </ListItemIcon>
              <ListItemText primary="Cards" />
            </ListItemButton>
            </ListItem>

          {canRead && (
            <>
              {['Customer', 'Employees'].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton onClick={() => handleNavigation(text)}>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          )}
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
}