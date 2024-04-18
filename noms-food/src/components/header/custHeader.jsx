import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import icon from '../../photo/nomsicon2.png'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const CustHeader = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()

    // Update the paths for the drawer
    const paths1 = ['/custHome','/profilepageCust',"/searchStores", "/viewCart/:storeId", "/reportItTicketCust", "/viewItTickets"];

    const [open, setOpen] = React.useState(false); // Open Drawer State

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {['Homepage','Profile', 'Search Stores', 'My Cart', 'Report IT Ticket', 'View My IT Tickets'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => navigate(paths1[index])}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Logout'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => { doSignOut().then(() => { navigate('/login') }) }}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      );

    
    return (

        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor:'white' }}>
        <Toolbar>
          
          {/* Icon */}
          <a href="/custHome">
          <img src={icon} alt="icon" style={{ height: '40px', margin: '0px' }} />          </a>
          {
                userLoggedIn
                    ?
                    <>
                        <IconButton
                            size="large"
                            edge="start"
                            color="teal"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                        <MenuIcon />
                        </IconButton>
                        <Drawer open={open} onClose={toggleDrawer(false)}>
                        {DrawerList}
                        </Drawer>
                        <Box sx={{ flexGrow: 1 }} /> {/* This Box pushes the icons to the right */}
                          {/* Cart Icon */}
                          <IconButton color="green" onClick={() => navigate('/viewCart')}>
                              <ShoppingCartIcon />
                          </IconButton>
                          {/* Profile Icon */}
                          <IconButton color="green" onClick={() => navigate('/profilepageCust')}>
                              <AccountCircleIcon />
                          </IconButton>  
                    </>
                    :
                    <>
                        <Button style={{ color: 'teal' }} onClick={() => navigate('/login')}> Login </Button>
                        <Button style={{ color: 'teal' }} onClick={() => navigate('/type')}> Register </Button>
                    </>
            }

        </Toolbar>
        </AppBar>
        </Box>
        
    )
}

export default CustHeader