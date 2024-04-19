import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, Grid } from '@mui/material';
import vendorwallpaper from "../../photo/vendorwallpaper.png";

const Home = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    return (
        <Box sx={{ flexGrow: 1 }}>
   
            <Grid container spacing={2} sx={{ height: 'auto', minHeight: '100vh', overflow: 'hidden', paddingLeft: '40px',}}>
                {/* Left side */}
                <Grid item xs={12} md={6} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start', // Align items to the start of the flex container
                    paddingRight: '80px', // Padding from the left of the container
                    paddingBottom: '70px',
                }}>
                    <Typography sx={{ fontWeight:'thin' }} color='grey' variant="h6" component="h1" gutterBottom>
                          |  YOU ARE NOW A MERCHANT  |
                    </Typography>
                    <Typography sx={{ fontWeight:'bold'}} variant="h3" component="h1" gutterBottom>
                        Grow your business with NOMs
                    </Typography>
                    <Box sx={{ '& > *': { m: 1 } }}> {/* Spacing between buttons */}
                        <Button sx={{ marginRight: 2 }}variant="contained" color="primary" onClick={() => navigate('/createlisting')}>
                            Create a Listing Now
                        </Button>
                        <Button variant="outlined" color="primary" onClick={() => navigate('/viewstore')}>
                            View Your Store
                        </Button>
                    </Box>
                </Grid>

                {/* Right side */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            backgroundImage: `url(${vendorwallpaper})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '100vh', // Make the image take up the full height of the viewport
                            width: '100%' // Ensure the image takes up the width of the Grid item
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;
