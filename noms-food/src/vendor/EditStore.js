import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadScript, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';
import './CreateStore.css'; // Assuming CSS styles are appropriate for EditStore as well
import { useAuth } from '../contexts/authContext';
import { doc, getDoc, getFirestore, query, collection, where, getDocs, updateDoc } from "firebase/firestore";

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

    try {
      const storeRef = doc(db, "Store", store.id);
      await updateDoc(storeRef, {
        ...store,
        location: marker,
      });

      console.log("Store updated successfully");
      navigate('/home'); // Navigate to home or store view page
    } catch (error) {
      console.error("Error updating store", error);
    }
  };

  if (!store) {
    return <div>Loading store details...</div>;
  }

  return (
    <div className="createStoreContainer flex flex-col items-center justify-center pt-16">
      <h2 className="title">Edit Your Store</h2>
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
            <LoadScript
                googleMapsApiKey="AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs"
                libraries={["places"]}
            >
                <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceSelect}>
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
            </LoadScript>
        </div>
        <button type="submit" className="submitButton">Update Store</button>
      </form>
    </div>
  );
}

export default EditStore;
