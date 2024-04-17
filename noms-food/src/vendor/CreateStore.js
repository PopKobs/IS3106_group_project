import React, { useState, useEffect } from 'react';
import { LoadScript, useLoadScript, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';
//import './CreateStore.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { collection, addDoc, getFirestore, query, where, getDocs, updateDoc } from "firebase/firestore";
import { Box, Container, Typography, TextField, Stack, Button } from "@mui/material";


function CreateStore() {
  const navigate = useNavigate();
  const { currentUserEmail } = useAuth();
  const [store, setStore] = useState({
    name: '',
    description: '',
    opening: '',
    closing: '',
    location: '',
    isOpen: false,
    creatorEmail: currentUserEmail || ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [marker, setMarker] = useState({ lat: null, lng: null });
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStore({
      ...store,
      [name]: value,
    });
  };

  const handlePlaceSelect = () => {
    const address = autocomplete.getPlace();
    setStore({
      ...store,
      location: address.formatted_address,
    });
    setMarker({ lat: address.geometry.location.lat(), lng: address.geometry.location.lng() });
  };

  const onLoad = (autoC) => setAutocomplete(autoC);

  useEffect(()=> {
    localStorage.setItem('isMapsApiLoaded', true);
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const db = getFirestore();
    try {
      const storeCollectionRef = collection(db, "Store");
      const storeDocRef = await addDoc(storeCollectionRef, {
        ...store,
        location: marker,
        creatorEmail: currentUserEmail,
      });

      const usersCollectionRef = collection(db, "Users");
      const q = query(usersCollectionRef, where("email", "==", currentUserEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming the email field is unique, there should only be one document
        const userDocRef = querySnapshot.docs[0].ref;

        // Step 3: Update the user document with the store ID
        await updateDoc(userDocRef, {
          storeId: storeDocRef.id,
        });

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        navigate('/home'); // Navigate to home after successful store creation
      } else {
        console.log("User not found.");
      }

    } catch (error) {
      console.error("Error adding store", error);
    }
  };

  const libraries = ["places"];
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs",
    libraries,
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
  <Typography variant='h3'>Sign your store up with NOMs!</Typography>
  <Box sx={{ mt: 2, width: '100%', maxWidth: 400 }}>
    <Stack spacing={2} direction="column">
      {/* TextField components */}
      <TextField
        id="name"
        label="Store Name"
        variant="filled"
        required
        onChange={handleInputChange}
      />
      <TextField
        id="description"
        label="Description"
        variant="filled"
        required
        onChange={handleInputChange}
      />
      <TextField
        id="opening"
        label="Opening Hours"
        variant="filled"
        required
        onChange={handleInputChange}
      />
      <TextField
        id="closing"
        label="Closing Hours"
        variant="filled"
        required
        onChange={handleInputChange}
      />
      <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceSelect}>
        <TextField
          id="location"
          label="Store Location"
          variant="filled"
          required
          placeholder='Type Store Location'
          onChange={handleInputChange}
        />
      </Autocomplete>
      {/* GoogleMap component */}
      {marker.lat && marker.lng && (
        <div className="googleMapContainer">
          <GoogleMap
            mapContainerClassName="googleMap"
            mapContainerStyle={{ height: "400px", width: "100%" }}
            center={marker}
            zoom={15}
          >
            <Marker position={marker} />
          </GoogleMap>
        </div>
      )}
    </Stack>
    <Button sx={{ mt: 2, width: '100%' }} onClick={(e) => handleSubmit(e)}>Sign Up Store</Button>
  </Box>
  <Box><Button style={{ backgroundColor:'#00897b', color: 'white' }} onClick={(e) => handleSubmit(e)}>Sign Up Store</Button></Box>
  {showSuccess && <Box sx={{ mt: 2 }}>Store signed up successfully!</Box>}
</Container>

  );
}

export default CreateStore;
