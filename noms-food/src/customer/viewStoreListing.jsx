import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import {
  Container, Modal, Box, IconButton, Stack, Card, CardMedia,
  CardContent, CardActions, Typography, Button, Grid, Paper,
  Dialog, DialogTitle, DialogContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import icon from '../photo/niceFood.jpg';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite'; import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Import AccessTimeIcon
import { red } from '@mui/material/colors';
import { green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';


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
  const [storeLocationString, setStoreLocationString] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStoreAndListings(storeId);
        setStoreListing(data);
        setStoreName(data.store.name);
        setStoreOpening(data.store.opening);
        setStoreClosing(data.store.closing);
        setStoreLocation(data.store.location);
        setStoreLocationString(data.store.locationString);
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

  // Modify the InfoHeader style to have a margin at the top, making it drop below the navbar
  const InfoHeader = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(3), // Adjust the margin as per your navbar height
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column', // Stack items vertically
    alignItems: 'flex-start', // Align items to the left
    gap: theme.spacing(1), // Add gap between items for better spacing
  }));

// Modify the StoreInfoHeader function to display information in a better layout
const StoreInfoHeader = () => {
  const navigate = useNavigate();
  const navigateToSearchStores = () => {
    // Navigate to '/searchStores' when the back icon is clicked
    navigate('/searchStores');
  };

  return (
    <InfoHeader>
      <Typography variant="h5" component="h1" gutterBottom>
        {storeName}
      </Typography>
      <Box display="flex" alignItems="center" gap={1}>
        <AccessTimeIcon style={{ color: 'green' }} />
        <Typography variant="subtitle1">
          {`Opening: ${storeOpening} - Closing: ${storeClosing}`}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <LocationOnIcon style={{ color: 'green' }} />
        <Typography variant="subtitle1">
          {storeLocationString || 'Location not specified'}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <InfoIcon style={{ color: 'green' }} />
        <Typography variant="subtitle1">
          {storeDescription || 'No description available'}
        </Typography>
        
        
        <IconButton onClick={navigateToSearchStores} sx={{ marginLeft: '900px', fontSize: '20px'}}>
        Return <ArrowBackIcon />
      </IconButton>
      </Box>
      <Button onClick={handleOpenReviewDialog} variant="contained" color="primary">
                View Reviews
      </Button>
      {/* Add IconButton for back navigation */}
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
    if (quantity < parseInt(selectedListing.stock, 10)) {
      setQuantity(quantity + 1);
    } else {
      alert("Max Quantity Avaliable");
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

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const handleOpenReviewDialog = async () => {
    try {
      const reviews = await fetchReviews();
      setReviews(reviews);
  
      if (reviews.length === 0) {
        setAverageRating(0);
      } else {
        const totalRating = reviews.reduce((accumulator, review) => accumulator + review.rating, 0);
        const avgRating = totalRating / reviews.length;
        setAverageRating(avgRating);
      }
  
      setReviewDialogOpen(true);
    } catch (error) {
      console.error('Error handling open review dialog:', error);
    }
    
  };

  const fetchReviews = async () => {
    const reviewsRef = collection(db, 'Review');
    const q = query(reviewsRef, where('storeId', '==', storeId));
    const querySnapshot = await getDocs(q);

    const reviewsData = [];
    querySnapshot.forEach((doc) => {
      reviewsData.push({ id: doc.id, ...doc.data() });
    });
    return reviewsData;
  }

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
  };

  return (
    <div>
      <StoreInfoHeader />
      <Container justifyContent='centre' maxWidth="md" sx={{ marginTop: '20px' }}>
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
            component={Link}
            to={`/viewCart/${storeId}`}
            sx={{ marginTop: '20px', marginBottom: '20px'}}
          >
            <ShoppingCartIcon sx={{ mr: 1 }} />
            Proceed to Cart
          </Button>


        )}

        <div>
            <Dialog open={reviewDialogOpen} onClose={handleCloseReviewDialog} fullWidth maxWidth="md">
                <DialogTitle>Reviews for this Shop</DialogTitle>
                <DialogContent>
                    {reviews.length > 0 ? (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <Typography variant="h6" sx={{ marginRight: '10px' }}>
                                    Average Rating:
                                </Typography>
                                {Array.from({ length: Math.floor(averageRating) }, (_, index) => (
                                    <StarIcon key={index} sx={{ color: '#FFD700', fontSize: '20px' }} />
                                ))}
                                {averageRating % 1 !== 0 && (
                                    <StarHalfIcon sx={{ color: '#FFD700', fontSize: '20px' }} />
                                )}
                                {Array.from({ length: Math.floor(5 - averageRating) }, (_, index) => (
                                    <StarBorderIcon key={index} sx={{ color: '#FFD700', fontSize: '20px' }} />
                                ))}
                                <Typography variant="h6" sx={{ marginLeft: '10px' }}>
                                    ({averageRating.toFixed(1)} / 5)
                                </Typography>
                            </Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Number of Ratings: {reviews.length}
                            </Typography>
                            {reviews.map(review => (
                                <Card key={review.id} style={{ marginBottom: '20px' }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            Rating:
                                        </Typography>
                                        {Array.from({ length: Math.floor(review.rating) }, (_, index) => (
                                            <StarIcon key={index} sx={{ color: '#FFD700', fontSize: '20px' }} />
                                        ))}
                                        {Array.from({ length: Math.max(5 - Math.ceil(review.rating), 0) }, (_, index) => (
                                            <StarBorderIcon key={index} sx={{ color: '#FFD700', fontSize: '20px' }} />
                                        ))}
                                        <Typography variant="body1">
                                            Comment: {review.comment}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            By: {review.userName}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body1">
                            No reviews found for this shop.
                        </Typography>
                    )}
                </DialogContent>
            </Dialog>
        </div>
      </Container>
    </div>
  );
}

const storage = getStorage();

function StoreListingCard({ listing, handleOpenModal, cartItems }) {
  const isInCart = cartItems.some(item => item.id === listing.id);
  const [imageLink, setImageLink] = useState(icon);

  const imageRef = ref(storage, `users/listing/${listing.id}`);
  /*console.log(`users/store/${store.id}`)*/
  getDownloadURL(imageRef)
    .then((url) => {
      // Set the image URL once it's fetched
      setImageLink(url)
    })
    .catch((error) => {

    });

  return (
    <Paper elevation={3} sx={{ borderRadius: 1, width: 700 }}>
      <Card sx={{ display: 'flex', flexDirection: 'row', width: 700, height: 170, }}>
        <CardMedia
          component="img"
          image={imageLink}
          alt={listing.title}
          sx={{ width: 170, height: 170, objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {listing.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ fontSize: '15px' }}>
            {listing.description}
          </Typography>
          <Typography variant="body2" color="text.primary" style={{ fontSize: '15px' }}>
            Price: ${listing.price}
          </Typography>
          <Typography variant="body2" color="text.primary"  style={{ fontSize: '15px' }}>
            Stock: {listing.stock}
          </Typography>
          <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {!isInCart ? (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleOpenModal(listing)}
              sx={{
                color: 'white',
                '&:hover': {
                },
              }}
            >
              Add to Cart
            </Button>
          ) : (
            <Typography 
              variant="body2" 
              style={{ color: 'darkred', fontSize: '15px', fontWeight: 'bold' }} 
            >
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
