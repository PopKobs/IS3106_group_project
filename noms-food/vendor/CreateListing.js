import React, { useState } from 'react';

function CreateListing() {
  // State to store the form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    // Add more fields as needed
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
    // You can add code here to send the data to your backend API
    // For simplicity, let's just reset the form data
    setFormData({
      title: '',
      description: '',
      price: 0,
    });
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
