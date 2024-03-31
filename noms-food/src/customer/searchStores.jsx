import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from "firebase/firestore";
import { Container, Grid, Typography, Card, CardContent, TextField, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function ViewStores() {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Store'));
        const storesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStores(storesData);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    // Sort by status: open stores come first
    if (a.isOpen === true && b.isOpen !== true) {
      return -1;
    } else if (a.status !== true && b.status === true) {
      return 1;
    } else {
      // If status is the same, maintain original order
      return 0;
    }
  });;

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
        <Grid container spacing={3}>
          {filteredStores.map(store => (
            <Grid item xs={12} sm={6} md={4} key={store.id}>
              <Box sx={{ opacity: store.isOpen !== true ? 0.5 : 1, cursor: store.isOpen === true ? 'pointer' : 'not-allowed' }}>
                <StoreCard store={store} disabled={store.isOpen !== true} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Container>
  );
}

function StoreCard({ store, disabled }) {
  return (
    <Box sx={{ opacity: store.isOpen !== true ? 0.5 : 1, cursor: store.isOpen === true ? 'pointer' : 'not-allowed' }}>
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