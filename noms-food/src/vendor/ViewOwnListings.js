import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import './ViewListing.css'; // Import the CSS file for styling

function ViewListing() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const db = getFirestore();
      const userId = getCurrentUserId(); // Assuming you have a function to get the current user's ID
      const q = query(collection(db, 'Listing'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedListings = [];
      querySnapshot.forEach((doc) => {
        fetchedListings.push({ id: doc.id, ...doc.data() });
      });
      setListings(fetchedListings);
      setLoading(false);
    };

    fetchListings();
  }, []);

  const getCurrentUserId = () => {
  
    return auth.currentUser?.uid; // UserId for association
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="viewListingContainer">
      <h2>My Listings</h2>
      {listings.length === 0 ? (
        <div>No listings found.</div>
      ) : (
        <div className="listingGrid">
          {listings.map((listing) => (
            <div key={listing.id} className="listingCard">
              <img src={listing.photoURL} alt={listing.title} />
              <div className="listingDetails">
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
                <p>Price: ${listing.price}</p>
                <p>Stock: {listing.stock}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewListing;
