import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import {
  Container, Modal, Box, IconButton, Stack, Card, CardMedia,
  CardContent, CardActions, Typography, Button, Grid, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import icon from '../photo/niceFood.jpg';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Import AccessTimeIcon
import { red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';

const fetchStoreAndListings = async (storeId) => {
  const auth = getAuth();
  try {
    // Fetch store details
    const storeDoc = await getDoc(doc(db, 'Store', storeId));
    const storeData = storeDoc.data();
    // console.log(storeData.userId);
    if (!storeData) {
      throw new Error('Store not found');
    }

    // Query listings related to the store ID
    const listingsQuery = query(collection(db, 'Listing'), where('userId', '==', storeData.userId));

    const listingsSnapshot = await getDocs(listingsQuery);
    const listingsData = listingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { store: storeData, listings: listingsData };
  } catch (error) {
    console.error('Error fetching store and listings:', error);
    throw error;
  }
};


function ViewStoreListings() {
  const { storeId } = useParams();
  const [storeListing, setStoreListing] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [storeOpening, setStoreOpening] = useState('');
  const [storeClosing, setStoreClosing] = useState('');
  const [storeDistance, setStoreDistance] = useState(0);
  const [storeDescription, setStoreDescription] = useState('');
  const [storeLocation, setStoreLocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStoreAndListings(storeId);
        setStoreListing(data);
        setStoreName(data.store.name);
        setStoreOpening(data.store.opening);
        setStoreClosing(data.store.closing);
        setStoreLocation(data.store.location);
        setStoreDistance(data.store.distance);
        setStoreDescription(data.store.description);
      } catch (error) {
        console.error('Error fetching store and listings:', error);
      }
    };

    fetchData();
  }, [storeId]);

  // <-----------------------------------------Store Info Header---------------------------------------------->
  
const HeaderContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#fff', // Adjust the background color as per your theme
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const InfoHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const StoreInfoHeader = () => {
  return (
    <InfoHeader>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            {storeName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <StyledIconButton aria-label="store location">
              <LocationOnIcon color="secondary" />
            </StyledIconButton>
            Store Location which is empty for now
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <StyledIconButton aria-label="store description">
              <InfoIcon color="action" />
            </StyledIconButton>
            {storeDescription}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {storeDistance}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ mr: 0.5 }} /> Opening: {storeOpening}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <AccessTimeIcon sx={{ mr: 0.5 }} /> Closing: {storeClosing}
          </Typography>
        </Grid>
      </Grid>
    </InfoHeader>
  );
};
  

// <---------------------------------------------------End--------------------------------------->

  useEffect(() => {
    const cartItemsKey = `cartItems_${storeId}`;
    const storedCartItems = sessionStorage.getItem(cartItemsKey);
    console.log(cartItemsKey);
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const handleOpenModal = (listing) => {
    setSelectedListing(listing);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
    setShowModal(false);
    setQuantity(1);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < parseInt(selectedListing.stock, 10)){
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    try {
      let updatedCartItems = cartItems.slice();
      const existingItemIndex = updatedCartItems.findIndex(item => item.id === selectedListing.id);
      if (existingItemIndex !== -1) {
        // Item already exists in cart, update its quantity
        updatedCartItems[existingItemIndex].quantity += quantity;
      } else {
        // Item is not in cart, add it
        const newItem = {
          id: selectedListing.id,
          title: selectedListing.title,
          description: selectedListing.description,
          quantity: quantity,
          price: selectedListing.price * quantity,
          unitPrice: selectedListing.price
        };
        updatedCartItems.push(newItem);
      }
      const cartItemsKey = `cartItems_${storeId}`;
      sessionStorage.setItem(cartItemsKey, JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      handleCloseModal();
      alert('Listing added to cart successfully!');
    } catch (error) {
      console.error('Error adding listing to cart:', error);
      alert('Failed to add listing to cart!');
    }
  };
    
  return (
    <div>
      <StoreInfoHeader/>
      <Container maxWidth="md" sx={{ marginTop: '20px' }}>
        {storeListing && (
          <>

            <Stack spacing={2}>
              {storeListing.listings.map(itemListing => (
                <StoreListingCard
                  key={itemListing.id}
                  listing={itemListing}
                  handleOpenModal={() => handleOpenModal(itemListing)}
                  cartItems={cartItems}
                />
              ))}
            </Stack>
          </>
        )}
        

        <Modal open={showModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'white',
              boxShadow: 24,
              p: 4,
              maxWidth: 400,
              borderRadius: 8,
            }}
          >
            {selectedListing && (
              <>
                <Typography variant="h5" gutterBottom>{selectedListing.title}</Typography>
                <Typography variant="body1" gutterBottom>{selectedListing.description}</Typography>
                <Typography variant="body1" gutterBottom>Quantity:</Typography>
                <IconButton onClick={handleDecreaseQuantity}><RemoveIcon /></IconButton>
                <Typography variant="body1" display="inline">{quantity}</Typography>
                <IconButton onClick={handleIncreaseQuantity}><AddIcon /></IconButton>
                <Typography variant="body1" gutterBottom>Total Price: ${selectedListing.price * quantity}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addToCart}
                  disabled={cartItems.some(item => item.id === selectedListing.id)}
                >
                  {cartItems.some(item => item.id === selectedListing.id) ? "Already in Cart" : "Add to Cart"}
                </Button>
              </>
            )}
          </Box>
        </Modal>
        {cartItems.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/viewCart/${storeId}`}
            sx={{ marginTop: '20px', bgcolor: 'white' }}
          >
            <ShoppingCartIcon sx={{ mr: 1 }} />
            Proceed to Cart
          </Button>
        )}
      </Container>
    </div>
  );
}
  

function StoreListingCard({ listing, handleOpenModal, cartItems }) {
  const isInCart = cartItems.some(item => item.id === listing.id);

  return (
    <Paper elevation={3} sx={{ borderRadius: 1, width: 700 }}>
      <Card sx={{ display: 'flex', flexDirection: 'row', width: 700, height: 160, }}>
        <CardMedia
          component="img"
          image={icon}
          alt={listing.title}
          sx={{ width: 160, height: 160, objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {listing.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ fontSize: '15px' }}>
            {listing.description}
          </Typography>
          <Typography variant="body2" color="text.primary"  style={{ fontSize: '15px' }}>
            Price: ${listing.price}
          </Typography>
          <CardActions>
            {!isInCart ? (
              <Button variant="contained" color="primary" onClick={() => handleOpenModal(listing)}
              sx={{
                marginTop: '10px', 
                float: 'right',
                bgcolor: 'teal',
                color: 'white',
                '&:hover':{
                  bgcolor: 'darkcyan',
                },
              }}
              >
               
                Add to Cart
              </Button>
            ) : (
              <Typography variant="body2" color="secondary" style={{ fontSize: '15px', fontWeight: 'bold', marginTop: '10px' }} >
                Item added to cart
              </Typography>
            )}
          </CardActions>
        </CardContent>
      </Card>
    </Paper>
  );
}


export default ViewStoreListings;
