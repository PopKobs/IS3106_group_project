import React, { useState, useEffect } from 'react';
import { collection, addDoc, getFirestore } from "firebase/firestore";
import './CreateListing.css'; // Import the CSS file for styling
import { getAuth } from 'firebase/auth';

function CreateListing() {

  const auth = getAuth(); // Get Current User State

  useEffect(() => {
    const userIden = auth.currentUser?.uid; // UserId for association
    if (userIden) {
      setListing(prevListing => ({
        ...prevListing,
        userId: userIden // User Association
      }));
    }
  }, [auth.currentUser]);

  // State to store the form data and a state for displaying the success message
  const [listing, setListing] = useState({
    title: '',
    description: '',
    price: 0,
    stock: 0,
  });
  const [showSuccess, setShowSuccess] = useState(false); // State to handle success message visibility
  const [errors, setErrors] = useState({}); // State to store form validation errors

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListing({
      ...listing,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
  const photo = e.target.files[0]; // Get the first selected file
  setListing({
    ...listing,
    photo: photo,
  });
};

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // Validation rules
    const validationErrors = {};
    if (!listing.title.trim()) {
      validationErrors.title = 'Title is required';
    }
    if (!listing.description.trim()) {
      validationErrors.description = 'Description is required';
    }
    if (listing.price <= 0) {
      validationErrors.price = 'Price must be greater than 0';
    }
    if (listing.stock <= 0) {
      validationErrors.stock = 'Stock must be greater than 0';
    }

    // If there are validation errors, update the state and return early
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // If no validation errors, proceed with adding the listing
    const db = getFirestore();

    try {
      const listingCollectionRef = collection(db, "Listing");
      await addDoc(listingCollectionRef, listing); 
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
          {errors.title && <div className="errorMessage">{errors.title}</div>}
        </div>
        <div className="formGroup">
          <label>Description:</label>
          <textarea name="description" value={listing.description} onChange={handleInputChange} />
          {errors.description && <div className="errorMessage">{errors.description}</div>}
        </div>
        <div className="formGroup">
          <label>Price ($):</label>
          <input type="number" name="price" value={listing.price} onChange={handleInputChange} />
          {errors.price && <div className="errorMessage">{errors.price}</div>}
        </div>
        <div className="formGroup">
          <label>Stock:</label>
          <input type="number" name="stock" value={listing.stock} onChange={handleInputChange} />
          {errors.stock && <div className="errorMessage">{errors.stock}</div>}
        </div>
        <button type="submit" className="submitButton">Create Listing</button>
      </form>
      {showSuccess && <div className="successMessage">Listing created successfully!</div>}
    </div>
  );
}

export default CreateListing;
