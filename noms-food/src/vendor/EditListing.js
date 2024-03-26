import React, { useState, useEffect } from 'react';
import { collection, doc, updateDoc, getDoc, getFirestore } from "firebase/firestore";
import './EditListing.css'; // Import the CSS file for styling

function EditListing({ listingId }) { // Assuming you're passing the listingId as a prop
  const [listing, setListing] = useState({
    title: '',
    description: '',
    price: 0,
    stock: 0,
  });
  const [showSuccess, setShowSuccess] = useState(false); // State to handle success message visibility

  const db = getFirestore();
  const listingRef = doc(db, "Listing", listingId);

  // Fetch the current listing data when the component mounts
  useEffect(() => {
    const fetchListing = async () => {
      const listingDoc = await getDoc(listingRef);
      if (listingDoc.exists()) {
        setListing(listingDoc.data());
      }
    };

    fetchListing();
  }, [listingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListing({
      ...listing,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(listingRef, listing);

      console.log('Updating listing:', listing);

      setShowSuccess(true); // Show success message upon submission
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds

    } catch (error) {
      console.error("Error updating listing", error);
      // Handle the error appropriately
    }
  };

    return (
        <div className="editListingContainer">
        <h2>Edit Listing</h2>
        <form onSubmit={handleSubmit} className="editForm">
            <div className="formGroup">
            <label>Title:</label>
            <input type="text" name="title" value={listing.title} onChange={handleInputChange} />
            </div>
            <div className="formGroup">
            <label>Description:</label>
            <textarea name="description" value={listing.description} onChange={handleInputChange} />
            </div>
            <div className="formGroup">
            <label>Price ($):</label>
            <input type="number" name="price" value={listing.price} onChange={handleInputChange} />
            </div>
            <div className="formGroup">
            <label>Stock:</label>
            <input type="number" name="stock" value={listing.stock} onChange={handleInputChange} />
            </div>
            <button type="submit">Update Listing</button>
            {showSuccess && <p className="successMessage">Listing updated successfully!</p>}
        </form>
        </div>
    );
}
export default EditListing;