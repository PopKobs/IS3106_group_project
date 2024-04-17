import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import icon from '../photo/niceFood.jpg'
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Box,
  // Rating, // Uncomment if you're using Rating
  // Stack, // Import Stack if you're using it below
} from '@mui/material';
import { Link } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const libraries = ["places"];

function ViewStores() {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [autocomplete, setAutocomplete] = useState(null);

  const onAutocompleteLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };
  const libraries = ["places"];
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs",
    libraries,
  });

  useEffect(() => {
    
    const fetchStores = async () => {
      try {
        await updateStoreStatus();
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
      if (store.creatorEmail) {
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

  const handlePlaceSelect = () => {
    const address = autocomplete.getPlace();
    setUserLocation({
      lat: address.geometry.location.lat(),
      lng: address.geometry.location.lng()
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadian = angle => (Math.PI / 180) * angle;
    const distance = (a, b) => (Math.PI / 180) * (a - b);
    const RADIUS_OF_EARTH_IN_KM = 6371;
  
    const dLat = distance(lat2, lat1);
    const dLon = distance(lon2, lon1);
  
    lat1 = toRadian(lat1);
    lat2 = toRadian(lat2);
  
    // Haversine formula
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return RADIUS_OF_EARTH_IN_KM * c;
  };
  

  // const filteredStores = stores.filter(store => store.isActive).filter(store =>
  //   store.name.toLowerCase().includes(searchTerm.toLowerCase())
  // ).sort((a, b) => {
  //   // Sort by status: open stores come first
  //   if (a.isOpen === true && b.isOpen !== true) {
  //     return -1;
  //   } else if (a.isOpen !== true && b.isOpen === true) {
  //     return 1;
  //   } else {
  //     // If status is the same, maintain original order
  //     return 0;
  //   }
  // });

  const filteredStores = stores.map(store => {
    const distance = userLocation.lat ? calculateDistance(userLocation.lat, userLocation.lng, store.location.lat, store.location.lng) : null;
    return { ...store, distance };
  }).filter(store => store.isActive && store.name.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => {
           if (a.isOpen === true && b.isOpen !== true) {
         return -1;
       } else if (a.isOpen !== true && b.isOpen === true) {
         return 1;
       } else {
    
         return 0;
       }
    }).sort((a, b) => {
    return a.distance - b.distance; // Sort by distance
  });

  const updateStoreStatus = async () => {
    const currentTime = new Date();
    const storesCollection = collection(db, 'Store');
    const storesSnapshot = await getDocs(storesCollection);

    storesSnapshot.forEach(async (storeDoc) => {
        const storeData = storeDoc.data();
        const openingHours = storeData.opening;
        const [openHour, openMinute] = openingHours.split(':').map(Number);
        const closingHours = storeData.closing;
        const [closeHour, closeMinute] = closingHours.split(':').map(Number);

        // Check if the store has opening hours defined
        if (openingHours) {
            const openTime = new Date(currentTime);
            openTime.setHours(openHour, openMinute, 0, 0);
            const closeTime = new Date(currentTime);
            closeTime.setHours(closeHour, closeMinute, 0, 0);

            // Check if the current time is between open and close hours
            if (currentTime >= openTime && currentTime <= closeTime) {
                // Store is open
                await updateDoc(doc(db, 'Store', storeDoc.id), { isOpen: true });
                //console.log(storeData.name + " Open pls");
            } else {
                // Store is closed
                await updateDoc(doc(db, 'Store', storeDoc.id), { isOpen: false });
                //console.log(storeData.name + " Close pls");
            }
        } else {
            // If opening hours are not defined, consider the store closed
            await updateDoc(doc(db, 'Store', storeDoc.id), { isOpen: false });
            //console.log(storeData.name + " Dont Exist pls");
        }
    });
};

  // // Card component refactored for better UI
  // function StoreCard({ store }) {
  //   const disabled = !store.isOpen;
  //   // const storeRating = store.rating || 0; // assuming you have a rating in your store object
  //   const imageLink = icon; // replace with the actual path to your image

  //   return (
  //     <Grid item xs={12} sm={6} md={3}>
  //       <Box sx={{ opacity: disabled ? 0.5 : 1, display: 'flex' }}>
  //         <Card raised sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
  //           <CardMedia
  //             component="img"
  //             height="140"
  //             image={imageLink}
  //             alt={store.name}
  //           />
  //           <Link to={`/store/${store.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
  //           <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
  //             <Typography gutterBottom variant="h5" component="div">
  //               {store.name}
  //             </Typography>
  //             <Typography variant="subtitle1" color="text.secondary" gutterBottom>
  //               {store.description.split(',')[0]} // assuming description contains location
  //             </Typography>
  //             {/* Conditional rendering for the opening time */}
  //             {store.openingTime && (
  //               <Typography variant="body2" color="text.secondary">
  //                 <AccessTimeIcon fontSize="small" />
  //                 {' Opened ' + store.openingTime}
  //               </Typography>
  //             )}
  //           </CardContent>
  //           </Link>
  //         </Card>
        
        
  //       </Box>
  //     </Grid>
  //   );
  // }
  const storage = getStorage();
  

function StoreCard({ store }) {
  const [imageLink, setImageLink] = useState(icon); 
  const disabled = !store.isOpen;
 
  
  const imageRef = ref(storage, `users/store/${store.id}`);
  /*console.log(`users/store/${store.id}`)*/
    getDownloadURL(imageRef)
      .then((url) => {
        // Set the image URL once it's fetched
        setImageLink(url)
      })
      .catch((error) => {
        // Handle any errors
        //console.log("no find")
      
      });

  // Format the distance to show only two decimal places
  const formattedDistance = store.distance === 0 ? "0 km" : store.distance ? `${store.distance.toFixed(2)} km` : "Distance not available";

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Box sx={{ opacity: disabled ? 0.5 : 1, display: 'flex' }}>
        <Card raised sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardMedia
            component="img"
            height="140"
            image={imageLink}
            alt={store.name}
          />
          <Link to={`/store/${store.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography gutterBottom variant="h5" component="div">
                {store.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {store.description.split(',')[0]}
              </Typography>
              {/* Include the distance here */}
              <Typography variant="body2" color="text.secondary">
                Distance: <b>{formattedDistance}</b>
              </Typography>
              {/* Conditional rendering for the opening time */}
              {store.openingTime && (
                <Typography variant="body2" color="text.secondary">
                  <AccessTimeIcon fontSize="small" />
                  {' Opened ' + store.openingTime}
                </Typography>
              )}
            </CardContent>
          </Link>
        </Card>
      </Box>
    </Grid>
  );
}


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}> {/* Changed to 'lg' and added padding on y-axis */}
      <Typography variant="h4" gutterBottom sx={{ pb: 2 }}>
        Available Stores
      </Typography>
      
      {isLoaded && (
        <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={handlePlaceSelect}>
          <TextField
            label="Enter your current location"
            variant="outlined"
            fullWidth
            placeholder="Type your location"
          />
        </Autocomplete>
      )}

      <TextField
        label="Search by store name"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Grid container spacing={2}>
        {filteredStores.map(store => (
          <StoreCard key={store.id} store={store} />
        ))}
      </Grid>
    </Container>
  );
}

export default ViewStores;


  // return (
  //   <Container
  //     maxWidth="sm"
  //     sx={{
  //       padding: '20px',
  //       height: '100vh',
  //       marginTop: '20px'
  //     }}>
  //     <Container maxWidth="sm"
  //       sx={{
  //         backgroundColor: 'white',
  //         padding: '20px',
  //         borderRadius: '10px',
  //         marginTop: '55px'
  //       }}>
  //       <Typography variant="h4" gutterBottom>
  //         Available Stores
  //       </Typography>
  //       <TextField
  //         label="Search by store name"
  //         variant="outlined"
  //         fullWidth
  //         value={searchTerm}
  //         onChange={e => setSearchTerm(e.target.value)}
  //         style={{ marginBottom: '20px' }}
  //       />
  //       <Stack direction="column" spacing={3}>
  //         {filteredStores.map(store => (
  //           <StoreCard key={store.id} store={store} />
  //         ))}
  //       </Stack>
  //     </Container>

    
  //   </Container>

  //   <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
  //   {filteredStores.map(store => (
  //     <StoreCard key={store.id} store={store} />
  //   ))}
  //   </Grid>