import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase'; // Import your Firebase configuration
import RecipeReviewCard from '../components/CardDisplay'; // Import the RecipeReviewCard component
import { collection, getDocs } from "firebase/firestore";

function StoreListings() {
  const [storeListings, setStoreListings] = useState([]);

  useEffect(() => {
    const fetchStoreListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Listing')); // Assuming 'storeListings' is your collection name
        const listingsData = querySnapshot.docs.map(doc => ({ id: doc.id, description: doc.data().description, title: doc.data().title }));
        setStoreListings(listingsData);
      } catch (error) {
        console.error('Error fetching store listings:', error);
      }
    };

    fetchStoreListings();
  }, []);

  return (
    <div>
      {storeListings.map(listing => (
        <RecipeReviewCard
          key={listing.id}
          title={listing.title}
          subheader={listing.description}
          image={listing.image}
          description={listing.description}
          // Add other props as needed
        />
      ))}
    </div>
  );
}

export default StoreListings;