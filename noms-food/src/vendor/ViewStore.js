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
import { LoadScript, GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'; // Correctly imported
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    Card,
    Stack,
    CardContent,
    CardMedia,
    Paper
} from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs",

    });

    const storage = getStorage();
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [storeId2, setStoreId] = useState("");

    useEffect(() => {

        const imageRef = ref(storage, `users/store/${storeId2}`);
        getDownloadURL(imageRef)
            .then((url) => {
                // Set the image URL once it's fetched
                setImageUrl(url);
            })
            .catch((error) => {
                // Handle any errors
                console.error('Error fetching image URL:', error);
            });
    }, [storeId2]);


    useEffect(() => {

        const fetchStore = async () => {
            // Step 1: Query the Users collection to get the user's storeId
            const q = query(collection(db, "Users"), where("email", "==", currentUserEmail));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0].data();
                const storeId = userDoc.storeId;
                setStoreId(storeId)

                // Step 2: Fetch the store details using the storeId
                const storeRef = doc(db, "Store", storeId);
                const storeDoc = await getDoc(storeRef);

                if (storeDoc.exists()) {
                    const storeData = storeDoc.data()
                    setStore(storeData);
                    console.log(storeDoc);
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
        if (store && store.location && isLoaded) { // Check if API is loaded
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: store.location }, (results, status) => {
                if (status === "OK") {
                    if (results[0]) {
                        setAddress(results[0].formatted_address);
                        console.log("Its Loaded")
                    } else {
                        console.log("No results found");
                    }
                } else {
                    console.log("Geocoder failed due to: " + status);
                }
            });
        }
    }, [store, isMapsApiLoaded]); // Depend on store.location and isMapsApiLoaded


    const navigateReview = (() => {
        navigate('/viewShopReviews');
    })

    // if (!store) {
    //     return <div>Loading store information...</div>;
    // }

    const containerStyle = {
        width: '100%', // Adjust width as needed
        height: '400px' // Adjust height as needed
    };

    return (
        <Container>
            <Typography sx={{ fontWeight: 'bold', paddingTop:'20px' }} color="primary" variant="h4" gutterBottom>
                           View Your Store
                    </Typography>
            {!store ? (
                <Typography>Loading store information...</Typography>
            ) : (
                <Grid container spacing={3} sx={{ paddingTop: '0px' }}>
                    
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardMedia
                                component="img"
                                sx={{ height: '208px', objectFit: 'contain' }}
                                image={imageUrl || 'default-store-image.jpg'} // Replace with a default image if imageUrl is not available
                                alt="Store"
                            />
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {store.name}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {store.description}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Opening Hours:</strong> {store.opening}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Closing Hours:</strong> {store.closing}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Store Location:</strong> {address}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={5} sx={{ height: containerStyle.height }}>
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={store.location}
                                    zoom={15}
                                >
                                    <Marker position={store.location} />
                                </GoogleMap>
                            ) : (
                                <Typography>Loading map...</Typography>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sx={{ paddingBottom: '20px'}}>
                        <Stack direction="row" spacing={2} justifyContent="left">
                            <Button variant="contained" onClick={navigateReview}>
                                View All Reviews
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleEditStore}>
                                Edit Store
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}

export default ViewStore;