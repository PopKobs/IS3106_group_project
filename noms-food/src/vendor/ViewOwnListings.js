import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getFirestore, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Grid, Card, CardContent, Typography, styled, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Delete } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const Title = styled(Typography)({
  textAlign: 'center',
  marginBottom: theme => theme.spacing(2),
});

function ViewOwnListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchListings = async () => {
      const db = getFirestore();
      const userId = getCurrentUserId();
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
  }, []);

  const getCurrentUserId = () => {
    return auth.currentUser?.uid;
  };

  const handleOpenConfirmation = (listingId) => {
    setConfirmationOpen(true);
    setListingToDelete(listingId);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    setListingToDelete(null);
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
    return <div>Loading...</div>;
  }

  return (
    <div className="viewListingContainer">
      <Title variant="h2">My Listings</Title>
      {listings.length === 0 ? (
        <div>No listings found.</div>
      ) : (
        <Grid container spacing={2}>
          {listings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <StyledCard>
                <CardContent>
                  <Title variant="h6">{listing.title}</Title>
                  <Typography variant="body1" component="p">{listing.description}</Typography>
                  <Typography variant="body2" color="textSecondary" component="p">Price: ${listing.price}</Typography>
                  <Typography variant="body2" color="textSecondary" component="p">Stock: {listing.stock}</Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleOpenConfirmation(listing.id)}
                >
                  Delete
                </Button>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog
        open={confirmationOpen}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this listing?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Cancel</Button>
          <Button onClick={handleDeleteListing} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ViewOwnListings; //i
