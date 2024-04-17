import React, { useState } from 'react';
import { LoadScript, useLoadScript, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';
import './CreateStore.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext'; 
import { collection, addDoc, getFirestore, query, where, getDocs, updateDoc } from "firebase/firestore";


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
    <div className="createStoreContainer flex flex-col items-center justify-center pt-16">
      <h2 className="title">Sign your store up with NOMs!</h2>
      <form onSubmit={handleSubmit} className="createForm w-full max-w-md mt-8 px-4">
        <div className="formGroup">
          <label>Store Name:</label>
          <input type="text" name="name" value={store.name} onChange={handleInputChange} />

          <label>Description:</label>
          <input type="text" name="description" value={store.description} onChange={handleInputChange} />
          
          <label>Opening Hour:</label>
          <input type="time" name="opening" value={store.opening} onChange={handleInputChange} />

          <label>Closing Hour:</label>
          <input type="time" name="closing" value={store.closing} onChange={handleInputChange} />

          <label>Location:</label>
            <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceSelect}>
              <input type="text" placeholder="Type location" />
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
        </div>
        <button type="submit" className="submitButton">Sign Up Store</button>
      </form>
      {showSuccess && <div className="successMessage">Store signed up successfully!</div>}
    </div>
  );
}

export default CreateStore;
