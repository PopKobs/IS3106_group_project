import React, { useState } from 'react';
import { collection, addDoc, getFirestore } from "firebase/firestore";
import './CreateListing.css'; // Import the CSS file for styling

function CreateListing() {
  // State to store the form data and a state for displaying the success message
  const [listing, setListing] = useState({
    title: '',
    description: '',
    price: 0,
    stock: 0,
  });
  const [showSuccess, setShowSuccess] = useState(false); // State to handle success message visibility

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListing({
      ...listing,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => { // Add 'async' here
    e.preventDefault(); // It's a good practice to call this at the beginning

    const db = getFirestore();

    try {
      const listingCollectionRef = collection(db, "Listing");
      await addDoc(listingCollectionRef, listing); // Assuming 'formData' is your listing data

      console.log('Submitting form:', listing);

      setShowSuccess(true); // Show success message upon submission
      setListing({ title: '', description: '', price: 0, stock: 0 }); // Reset form data
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds

    } catch (error) {
      console.error("Error adding listing", error);
      // Handle the error appropriately
    }
  };


  return (
    <div className="createListingContainer">
      <h2>Create Listing</h2>
      <form onSubmit={handleSubmit} className="createForm">
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
        <button type="submit" className="submitButton">Create Listing</button>
      </form>
      {showSuccess && <div className="successMessage">Listing created successfully!</div>}
    </div>
  );
}

export default CreateListing;
