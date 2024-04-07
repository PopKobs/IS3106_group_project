import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
import { Container, Stack, Typography, Card, CardContent, TextField, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function ViewStores() {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Store'));
        const storesData = querySnapshot.docs.map(async (doc) => {
          const storeData = { id: doc.id, ...doc.data() };
          const isActive = await isUserActive(storeData); // Check user status
          return { ...storeData, isActive }; // Merge with existing store data
        });
        const storesWithStatus = await Promise.all(storesData);
        setStores(storesWithStatus);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  const isUserActive = async (store) => {
    try {
      if(store.creatorEmail){
      const userQuerySnapshot = await getDocs(query(collection(db, 'Users'), where("email", "==", store.creatorEmail)));
      let userIsActive = false;
      const firstDoc = userQuerySnapshot.docs[0];
      
      if (firstDoc && firstDoc.data().status === "Active") {
        userIsActive = true;
      }
      return userIsActive;
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      throw error;
    }
  };

  const filteredStores = stores.filter(store => store.isActive).filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    // Sort by status: open stores come first
    if (a.isOpen === true && b.isOpen !== true) {
      return -1;
    } else if (a.isOpen !== true && b.isOpen === true) {
      return 1;
    } else {
      // If status is the same, maintain original order
      return 0;
    }
  });

  return (
    <Container
      maxWidth="sm"
      sx={{
        padding: '20px',
        height: '100vh',
        marginTop: '20px'
      }}>
      <Container maxWidth="sm"
        sx={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '55px'
        }}>
        <Typography variant="h4" gutterBottom>
          Available Stores
        </Typography>
        <TextField
          label="Search by store name"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <Stack direction="column" spacing={3}>
          {filteredStores.map(store => (
            <StoreCard key={store.id} store={store} />
          ))}
        </Stack>
      </Container>
    </Container>
  );
}

function StoreCard({ store }) {
  const disabled = !store.isOpen;

  return (
    <Box sx={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {disabled ? (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {store.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {store.description}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Link to={`/store/${store.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {store.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {store.description}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      )}
    </Box>
  );
}

export default ViewStores;