import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import icon from '../../photo/nomsicon.png'
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

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()

    // Update the paths for the drawer
    const paths1 = ['/home','/profilepage', '/createstore', '/viewstore', '/createlisting', '/viewownlistings'];

    const [open, setOpen] = React.useState(false); // Open Drawer State

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Homepage','Profile', 'Create Store', 'View Store', 'Create Listing', 'View Listing'].map((text, index) => (
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
        <Box sx={{ flexGrow: 1}} >
        <AppBar position="static" sx={{ backgroundColor: 'primary' }}>
        <Toolbar >
          
          {/* Icon */}
          <a href="/">
          <img src={icon} alt="icon" style={{ width: '64px', height: '64px', margin: '0px' }} />
          </a>

          {
                userLoggedIn
                    ?
                    <>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                        <MenuIcon />
                        </IconButton>
                        <Drawer open={open} onClose={toggleDrawer(false)}>
                        {DrawerList}
                        </Drawer>
                    </>
                    :
                    <>
                        <Button style={{ color: 'white' }} onClick={() => navigate('/login')}> Login </Button>
                        <Button style={{ color: 'white' }} onClick={() => navigate('/type')}> Register </Button>
                    </>
            }

        </Toolbar>
        </AppBar>
        </Box>

    )
}

export default Header