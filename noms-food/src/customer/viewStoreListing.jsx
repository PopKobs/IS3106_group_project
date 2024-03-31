import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent, Typography, Container, Grid } from '@mui/material';

const fetchStoreAndListings = async (storeId) => {
  try {
    const storeDoc = await getDoc(doc(db, 'Store', storeId));
    const storeData = storeDoc.data();

    if (!storeData) {
      throw new Error('Store not found');
    }

    const creatorEmail = storeData.creatorEmail;

    const userQuery = query(collection(db, 'Users'), where('email', '==', creatorEmail));
    const userSnapshot = await getDocs(userQuery);
    const userData = userSnapshot.docs[0].data();

    if (!userData) {
      throw new Error('User not found');
    }

    const userId = userData.id;

    const listingsQuery = query(collection(db, 'Listing'), where('userId', '==', userId));
    const listingsSnapshot = await getDocs(listingsQuery);
    const listingsData = listingsSnapshot.docs.map(doc => doc.data());

    return { store: storeData, listings: listingsData };
  } catch (error) {
    console.error('Error fetching store and listings:', error);
    throw error;
  }
};

function ViewStoreListings() {
  const { storeId } = useParams();
  const [storeListing, setStoreListing] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStoreAndListings(storeId);
        setStoreListing(data);
      } catch (error) {
        console.error('Error fetching store and listings:', error);
      }
    };

    fetchData();
  }, [storeId]);

  return (
    <Container
        maxWidth="sm" 
        sx={{  
          padding: '20px', 
          height: '100vh' }}>
    <Container 
    maxWidth="lg"
    sx={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        marginTop: '55px' }}>
      {storeListing && (
        <div>
          <Typography variant="h2" gutterBottom>{storeListing.store.name}</Typography>
          <Typography variant="body1" gutterBottom>{storeListing.store.description}</Typography>
          <Typography variant="h3" gutterBottom>Listings</Typography>
          <Grid container spacing={3}>
            {storeListing.listings.map(listing => (
              <Grid item key={listing.id} xs={12} md={6} lg={4}>
                <StoreListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </Container>
    </Container>
  );
  
  function StoreListingCard({ listing }) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {listing.title}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {listing.description}
          </Typography>
        </CardContent>
      </Card>
    );
  }

}

export default ViewStoreListings;