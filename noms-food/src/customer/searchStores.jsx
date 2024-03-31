import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from "firebase/firestore";
import { Container, Grid, Typography, Card, CardContent, TextField } from '@mui/material';
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
  );

  return (
    <Container
      maxWidth="sm" 
      sx={{  
        padding: '20px', 
        height: '100vh',
        marginTop: '20px' }}>
      <Container maxWidth="sm"
        sx={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          marginTop: '55px' }}>
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
              <StoreCard store={store} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Container>
  );
}

function StoreCard({ store }) {
  return (
    <Link to={`/store/${store.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {store.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {store.description}
          </Typography>
          {/* Add more details here if needed */}
        </CardContent>
      </Card>
    </Link>
  );
}

export default ViewStores;