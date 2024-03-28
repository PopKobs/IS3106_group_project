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


function ViewStore() {
    const { currentUserEmail } = useAuth();
    const [store, setStore] = useState(null);
    const db = getFirestore();
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

    if (!store) {
        return <div>Loading store information...</div>;
    }

    const containerStyle = {
        width: '800px', // Adjust width as needed
        height: '400px' // Adjust height as needed
    };

    return (
        <LoadScript
            googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" // Ensure to use your actual Google Maps API key
        >
            <div>
                <br/> <br/>
                <h2>Store Name: {store.name}</h2>
                <p>Description: {store.description}</p>
                <p>Opening Hours: {store.opening}</p>
                <p>Closing Hours: {store.closing}</p>
                <div>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={store.location}
                        zoom={15}
                    >
                        <Marker position={store.location} />
                    </GoogleMap>
                </div>
                <p>Rating: 4.5/5 (Fake Rating)</p> <br/>
                <button onClick={() => console.log('View Reviews clicked')}>View Reviews</button> <br/><br/>
                <button onClick={() => console.log('Add Rating clicked')}>Add Rating</button>
            </div>
        </LoadScript>
    );
}

export default ViewStore;
