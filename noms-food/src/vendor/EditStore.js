import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import './CreateStore.css'; // Assuming CSS styles are appropriate for EditStore as well
import { useAuth } from '../contexts/authContext';
import { doc, getDoc, getFirestore, query, collection, where, getDocs, updateDoc } from "firebase/firestore";
import { Box, Container, Typography, TextField, Stack, Button } from "@mui/material";
//import { GeoPoint } from 'firebase/firestore';

function EditStore() {
  const navigate = useNavigate();
  const { currentUserEmail } = useAuth();
  const db = getFirestore();
  const [store, setStore] = useState({
    name: '',
    description: '',
    opening: '',
    closing: '',
    location: { lat: null, lng: null },
    isOpen: false,
  });
  const [autocomplete, setAutocomplete] = useState(null);
  const [marker, setMarker] = useState({ lat: null, lng: null });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs",
    libraries: ["places"]

  });

  useEffect(() => {
    const fetchStore = async () => {
      const q = query(collection(db, "Users"), where("email", "==", currentUserEmail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        const storeId = userDoc.storeId;
        const storeRef = doc(db, "Store", storeId);
        const storeDoc = await getDoc(storeRef);
        if (storeDoc.exists()) {
          const storeData = storeDoc.data();
          setStore({ ...storeData, id: storeId });
          setMarker(storeData.location);
        } else {
          console.log("No store found.");
        }
      } else {
        console.log("User not found.");
      }
    };

    fetchStore();
  }, [currentUserEmail, db]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(store.id)
    try {
      //const locationGeoPoint = new GeoPoint(marker.lat, marker.lng);
      const storeRef = doc(db, "Store", store.id);
      await updateDoc(storeRef, {
        location: marker,
      });

      console.log("Store updated successfully");
      navigate('/viewstore'); // Navigate to home or store view page
    } catch (error) {
      console.error("Error updating store", error);
    }
  };

  if (!store) {
    return <div>Loading store details...</div>;
  }


  if (loadError) {
    return <div>Error loading Google Maps script.</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps script...</div>;
  }


  return (

    <Container>
      {!store && !isLoaded ? <div>Loading store information...</div>
        :
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
                value={store.name}
                onChange={handleInputChange}
              />
              <TextField
                id="description"
                label="Description"
                variant="filled"
                required
                value={store.description}
                onChange={handleInputChange}
              />
              <TextField
                id="opening"
                label="Opening Hours"
                variant="filled"
                required
                value={store.opening}
                onChange={handleInputChange}
              />
              <TextField
                id="closing"
                label="Closing Hours"
                variant="filled"
                required
                value={store.closing}
                onChange={handleInputChange}
              />
              <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceSelect}>
                {/* <input type="text" placeholder="Type new location" /> */}
                <TextField
                  id="location"
                  label="New Store Location"
                  variant="filled"
                  required
                  placeholder='Type New Store Location'
                  onChange={handleInputChange}
                  sx={{ width: '100%' }}
                />
              </Autocomplete>
              {marker.lat && marker.lng && (
                <div className="googleMapContainer">
                  <GoogleMap
                    mapContainerClassName="googleMap"
                    mapContainerStyle={{ height: "400px", width: "800px" }}
                    center={marker}
                    zoom={15}
                  >
                    <Marker position={marker} />
                  </GoogleMap>
                </div>
              )}
            </Stack>
            {/* <Button sx={{ mt: 2, width: '100%' }} onClick={(e) => handleSubmit(e)}>Save Details </Button> */}
          </Box>
          <Box><Button style={{ backgroundColor: '#00897b', color: 'white' }} onClick={(e) => handleSubmit(e)}>Save Details</Button></Box>
          {/* {showSuccess && <Box sx={{ mt: 2 }}>Store signed up successfully!</Box>} */}
        </Container>
      }
    </Container>






  );
}

export default EditStore;

// <div className="createStoreContainer flex flex-col items-center justify-center pt-16">
//   <h2 className="title">Edit Your Store</h2>
//   <form onSubmit={handleSubmit} className="createForm w-full max-w-md mt-8 px-4">
//     <div className="formGroup">
//       <label>Store Name:</label>
//       <input type="text" name="name" value={store.name} onChange={handleInputChange} />

//       <label>Description:</label>
//       <input type="text" name="description" value={store.description} onChange={handleInputChange} />

//       <label>Opening Hour:</label>
//       <input type="time" name="opening" value={store.opening} onChange={handleInputChange} />

//       <label>Closing Hour:</label>
//       <input type="time" name="closing" value={store.closing} onChange={handleInputChange} />

//       <label>Location:</label>
//         <LoadScript
//             googleMapsApiKey="AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs"
//             libraries={["places"]}
//         >
//             <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceSelect}>
//             <input type="text" placeholder="Type location" />
//             </Autocomplete>
//             {marker.lat && marker.lng && (
//             <div className="googleMapContainer">
//             <GoogleMap
//                 mapContainerClassName="googleMap"
//                 mapContainerStyle={{ height: "400px", width: "800px" }}
//                 center={marker}
//                 zoom={15}
//             >
//                 <Marker position={marker} />
//             </GoogleMap>
//             </div>
//             )}
//         </LoadScript>
//     </div>
//     <button type="submit" className="submitButton">Update Store</button>
//   </form>
// </div>