import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import { updateDoc } from 'firebase/firestore';
import { collection, query, where, getDocs, getFirestore, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Grid, Card, CardContent, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Container, Button, TextField } from '@mui/material';


import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  backgroundColor: 'white',
  border: `1px solid ${theme.palette.divider}`, // Add border
  boxShadow: theme.shadows[1], // Optional: Adds a subtle shadow (remove if you prefer a flat design)
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

function ViewOwnListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const auth = getAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      const db = getFirestore();
      const userId = auth.currentUser?.uid;
      const q = query(collection(db, 'Listing'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedListings = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedListings.push({ id: doc.id, ...data });
      });
      setListings(fetchedListings);
      setLoading(false);
    };

    fetchListings();
  }, [auth]);

  const handleOpenConfirmation = (listingId) => {
    setConfirmationOpen(true);
    setListingToDelete(listingId);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    setListingToDelete(null);
  };

  const handleOpenEditDialog = (listing) => {
    setCurrentListing(listing);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentListing(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentListing({ ...currentListing, [name]: value });
  };

  const handleUpdateListing = async () => {
    if (currentListing) {
      const db = getFirestore();
      const listingRef = doc(db, 'Listing', currentListing.id);
      try {
        await updateDoc(listingRef, {
          title: currentListing.title,
          description: currentListing.description,
          price: currentListing.price,
          stock: currentListing.stock
        });
        // Update local state
        setListings(listings.map(listing => listing.id === currentListing.id ? currentListing : listing));
        handleCloseEditDialog();
      } catch (error) {
        console.error('Error updating listing:', error);
      }
    }
  };


  const handleDeleteListing = async () => {
    const db = getFirestore();
    try {
      await deleteDoc(doc(db, 'Listing', listingToDelete));
      setListings(prevListings => prevListings.filter(listing => listing.id !== listingToDelete));
      handleCloseConfirmation();
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  if (loading) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Container>;
  }

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 'bold', color: 'darkgreen', pb: 2 }}>
        My Listings
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : listings.length === 0 ? (
        <Typography>No listings found.</Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {listings.map((listing) => (
            <Grid item xs={12} md={6} key={listing.id}>
              <StyledCard>
                <div>
                  <Typography variant="h6">{listing.title}</Typography>
                  <Typography variant="body1">{listing.description}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price: ${listing.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Stock: {listing.stock}
                  </Typography>
                </div>
                <Stack direction="column" spacing={1}>
                <IconButton 
                  onClick={() => handleOpenEditDialog(listing)} 
                  sx={{ color: 'black' }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleOpenConfirmation(listing.id)} 
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

<Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
      <DialogTitle>Edit Listing</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          fullWidth
          label="Title"
          name="title"
          value={currentListing?.title || ''}
          onChange={handleEditInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Description"
          name="description"
          multiline
          rows={4}
          value={currentListing?.description || ''}
          onChange={handleEditInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Price ($)"
          name="price"
          type="number"
          value={currentListing?.price || ''}
          onChange={handleEditInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Stock"
          name="stock"
          type="number"
          value={currentListing?.stock || ''}
          onChange={handleEditInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditDialog} color="primary">Cancel</Button>
        <Button onClick={handleUpdateListing} color="primary">Save</Button>
      </DialogActions>
    </Dialog>

      <Dialog open={confirmationOpen} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this listing?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Cancel</Button>
          <Button onClick={handleDeleteListing} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
}

export default ViewOwnListings;