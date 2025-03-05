
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

  // Function to check if the user has read permission and set the state accordingly
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