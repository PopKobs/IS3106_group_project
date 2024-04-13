import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent, Typography, Button, Modal, Box, IconButton, Container, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const fetchStoreAndListings = async (storeId) => {
  try {
    // Fetch store details
    const storeDoc = await getDoc(doc(db, 'Store', storeId));
    const storeData = storeDoc.data();

    if (!storeData) {
      throw new Error('Store not found');
    }

    // Query listings related to the store ID
    const listingsQuery = query(collection(db, 'Listing'), where('storeId', '==', storeId));
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
    setQuantity(quantity + 1);
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
      <Container
        maxWidth="sm"
        sx={{
          padding: '20px',
          height: '100vh',
          marginTop: '20px'
        }}>
        {selectedListing && (
          <Modal open={showModal} onClose={handleCloseModal}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'white',
              boxShadow: 24,
              p: 4,
              maxWidth: 400,
              borderRadius: 8,
            }}>
              <Typography variant="h5" gutterBottom>{selectedListing.title}</Typography>
              <Typography variant="body1" gutterBottom>{selectedListing.description}</Typography>
              <Typography variant="body1" gutterBottom>Quantity:</Typography>
              <IconButton onClick={handleDecreaseQuantity}><RemoveIcon /></IconButton>
              <Typography variant="body1" display="inline">{quantity}</Typography>
              <IconButton onClick={handleIncreaseQuantity}><AddIcon /></IconButton>
              <Typography variant="body1" gutterBottom>Total Price: ${selectedListing.price * quantity}</Typography>
              {cartItems.some(item => item.id === selectedListing.id) ? null :
                <Button variant="contained" color="primary" onClick={addToCart}>Add to Cart</Button>
              }
            </Box>
          </Modal>
        )}
        {/* Your store listings */}
        {storeListing && (
          <Stack direction="column" spacing={3}>
            {storeListing.listings.map(itemListing => (
              <StoreListingCard
                key={itemListing.id}
                listing={itemListing}
                handleOpenModal={() => handleOpenModal(itemListing)}
                cartItems={cartItems}
              />
            ))}
          </Stack>
        )}
        {cartItems.length > 0 && (
          <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/viewCart/${storeId}`}
        >
            Proceed to Cart
          </Button>
        )}
      </Container>
    </div>
  );
}

function StoreListingCard({ listing, handleOpenModal, cartItems }) {
  const isInCart = cartItems.some(item => item.id === listing.id);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (isInCart) {
      setAddedToCart(true);
    }
  }, [isInCart]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {listing.title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {listing.description}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="body1" gutterBottom>Price: ${listing.price}</Typography>
          </div>
          {!isInCart && (
            <div>
              <Button variant="contained" color="primary" onClick={handleOpenModal}>
                Add to Cart
              </Button>
            </div>
          )}
          {addedToCart && (
            <Typography variant="body2" color="textSecondary">
              Item added to cart
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ViewStoreListings;