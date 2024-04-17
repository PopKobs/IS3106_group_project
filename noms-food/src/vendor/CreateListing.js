import React, { useState, useEffect } from 'react';
import { collection, addDoc, getFirestore} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Container, TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';

function CreateListing() {
  const auth = getAuth();

  useEffect(() => {
    const userIden = auth.currentUser?.uid;
    if (userIden) {
      setListing((prevListing) => ({
        ...prevListing,
        userId: userIden,
        
      }));
    }
  }, [auth.currentUser]);

  const [listing, setListing] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListing({
      ...listing,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!listing.title.trim()) validationErrors.title = 'Title is required';
    if (!listing.description.trim()) validationErrors.description = 'Description is required';
    if (!listing.price || Number(listing.price) <= 0) validationErrors.price = 'Price must be greater than 0';
    if (!listing.stock || Number(listing.stock) <= 0) validationErrors.stock = 'Stock must be greater than 0';

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const db = getFirestore();
    try {
      const listingWithStoreId = { ...listing, userId: auth.currentUser.uid }; // Assuming the storeId is the userId for simplicity
      await addDoc(collection(db, 'Listing'), listingWithStoreId);
      setShowSuccess(true);
      setListing({ title: '', description: '', price: '', stock: '' });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding listing', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white' }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            color: 'black',
            mb: 3,
            fontWeight: 'bold' // This makes the text bold
          }}
        >
          Create Listing
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={listing.title}
            onChange={handleInputChange}
            error={!!errors.title}
            helperText={errors.title}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0,0,0,0.23)', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: '#0d6659', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0d6659', // Border color when input is focused
                },
              }
            }}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={listing.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0,0,0,0.23)',
                },
                '&:hover fieldset': {
                  borderColor: '#0d6659',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0d6659',
                },
              }
            }}
          />
          <TextField
            fullWidth
            label="Price ($)"
            name="price"
            type="number"
            value={listing.price}
            onChange={handleInputChange}
            error={!!errors.price}
            helperText={errors.price}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0,0,0,0.23)',
                },
                '&:hover fieldset': {
                  borderColor: '#0d6659',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0d6659',
                },
              }
            }}
          />
          <TextField
            fullWidth
            label="Stock"
            name="stock"
            type="number"
            value={listing.stock}
            onChange={handleInputChange}
            error={!!errors.stock}
            helperText={errors.stock}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0,0,0,0.23)',
                },
                '&:hover fieldset': {
                  borderColor: '#0d6659',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0d6659',
                },
                
                '&.Mui-focused .MuiInputLabel-outlined': {
                  color: '#0d6659' // Label color when input is focused
                }
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#0d6659', '&:hover': { backgroundColor: '#32B48E' } }}
          >
            Create Listing
          </Button>
          {showSuccess && (
            <Alert severity="success" sx={{ mt: 3 }}>
              Listing created successfully!
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateListing;
