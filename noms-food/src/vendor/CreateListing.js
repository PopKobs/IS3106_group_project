import firebase from "firebase/app";
import React, { useState } from 'react';

const firebase = require('firebase');
require('firebase\firestore');

const database = firebase.firestore();

function CreateListing(/*front end input*/) {
  // State to store the form data
  const {data} = useState({
    listingName: '', //front end input
    description: '', //front end input
    photo: '', //front end input
    price: 0, //front end input
    quantity: 0, //front end input, consider adding function to notify vendor if quantity is running low
    note: '',
    avaliablilty: '', // period when its avaliable
    vendorId: ''
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send formData to the server
    console.log('Submitting form:', formData);

    setFormData({
      listingName: '', //front end input
      description: '', //front end input
      photo: '', //front end input
      price: 0, //front end input
      quantity: 0, //front end input, consider adding function to notify vendor if quantity is running low
      note: '',
      avaliablilty: '', // period when its avaliable
      vendorId: ''
    });

    collectionRef = collection(db, 'listingVendorA');
    return db.addDoc(collectionRef, data);
  };

  return (
    <div>
      <h2>Create Listing</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateListing;
