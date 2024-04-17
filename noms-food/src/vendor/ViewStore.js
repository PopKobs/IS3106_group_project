import React, { useEffect, useState } from 'react';
import { 
    doc, 
    getDoc, 
    getFirestore, 
    query, 
    collection, 
    where, 
    getDocs,
    updateDoc 
} from "firebase/firestore";
import { useAuth } from '../contexts/authContext'; // Adjust the import path as necessary
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'; // Correctly imported
import { useNavigate } from 'react-router-dom';
import './ViewStore.css';

function ViewStore() {
    const { currentUserEmail } = useAuth();
    const [store, setStore] = useState(null);
    const [address, setAddress] = useState("");
    const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false); // Add this line

    const db = getFirestore();
    const navigate = useNavigate();

    const handleEditStore = () => {
        navigate('/editstore');
      };

    useEffect(() => {
        const fetchStore = async () => {
            // Step 1: Query the Users collection to get the user's storeId
            const q = query(collection(db, "Users"), where("email", "==", currentUserEmail));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0].data();
                const storeId = userDoc.storeId;

                // Step 2: Fetch the store details using the storeId
                const storeRef = doc(db, "Store", storeId);
                const storeDoc = await getDoc(storeRef);

                if (storeDoc.exists()) {
                    setStore(storeDoc.data());
                } else {
                    console.log("No store found.");
                }
            } else {
                console.log("User not found.");
            }
        };

        fetchStore();
    }, [currentUserEmail, db]);

    useEffect(() => {
        if (store && store.location && isMapsApiLoaded) { // Check if API is loaded
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: store.location }, (results, status) => {
                if (status === "OK") {
                    if (results[0]) {
                        setAddress(results[0].formatted_address);
                    } else {
                        console.log("No results found");
                    }
                } else {
                    console.log("Geocoder failed due to: " + status);
                }
            });
        }
    }, [store, isMapsApiLoaded]); // Depend on store.location and isMapsApiLoaded
    

    if (!store) {
        return <div>Loading store information...</div>;
    }

    const containerStyle = {
        width: '800px', // Adjust width as needed
        height: '400px' // Adjust height as needed
    };

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs" 
            onLoad={() => setIsMapsApiLoaded(true)} 
        >
            <div className="ViewStore-container">
                <br/> <br/>
                <h2 className="ViewStore-header">View Your Store</h2>
                <div className="ViewStore-details">
                <p><b>Store Name:</b> {store.name}</p>
                <p><b>Description:</b> {store.description}</p>
                <p><b>Opening Hours:</b> {store.opening}</p>
                <p><b>Closing Hours:</b> {store.closing}</p>
                <p><b>Store Location:</b> {address}</p>
                </div>
                <div className="ViewStore-mapContainer">
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={store.location}
                        zoom={15}
                    >
                        <Marker position={store.location} />
                    </GoogleMap>
                </div>
                <p>Rating: 4.5/5 (Fake Rating)</p> <br/>
                <button className="ViewStore-button" onClick={() => console.log('View Reviews clicked')}>View Reviews</button> <br/><br/>
                <button className="ViewStore-button" onClick={handleEditStore}>Edit Store</button> <br/><br/>
            </div>
        </LoadScript>
    );
}

export default ViewStore;
