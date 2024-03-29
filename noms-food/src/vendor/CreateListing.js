import React, { useState, useEffect } from 'react';
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage related functions

import './CreateListing.css'; 

function CreateListing() {
  const auth = getAuth(); 
  const [listing, setListing] = useState({
    title: '',
    description: '',
    price: 0,
    stock: 0,
    photo: null, 
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const userIden = auth.currentUser?.uid;
    if (userIden) {
        setListing(prevListing => ({
            ...prevListing,
            userId: userIden 
        }));
    }
}, [auth.currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListing({
      ...listing,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const photo = e.target.files[0]; 
    setListing({
      ...listing,
      photo: photo,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const db = getFirestore();

    try {
      const listingCollectionRef = collection(db, "Listing");

      const storage = getStorage(); // Get storage instance
      const storageRef = ref(storage, `listing_photos/${listing.photo.name}`); // Use 'ref' from Firebase Storage
      await uploadBytes(storageRef, listing.photo); // Use 'uploadBytes' from Firebase Storage
      const photoURL = await getDownloadURL(storageRef); // Use 'getDownloadURL' from Firebase Storage

      await addDoc(listingCollectionRef, {
        ...listing,
        photoURL: photoURL, 
      });

      console.log('Submitting form:', listing);

      setShowSuccess(true); 
      setListing({ title: '', description: '', price: 0, stock: 0, photo: null }); 
      setTimeout(() => setShowSuccess(false), 3000); 

    } catch (error) {
      console.error("Error adding listing", error);
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
        <div className="formGroup">
          <label>Photo:</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>
        <button type="submit" className="submitButton">Create Listing</button>
      </form>
      {showSuccess && <div className="successMessage">Listing created successfully!</div>}
    </div>
  );
}

export default CreateListing;
