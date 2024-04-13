import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, Paper } from '@mui/material';

const CustHome = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, backgroundColor: 'white' }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Hello {currentUser.displayName || currentUser.email}, you are now logged in.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => navigate('/reportItTicket')}
            sx={{ maxWidth: '200px' }}
          >
            Report IT Issue
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => navigate('/viewItTickets')}
            sx={{ maxWidth: '200px' }}
          >
            View my IT tickets
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CustHome;
