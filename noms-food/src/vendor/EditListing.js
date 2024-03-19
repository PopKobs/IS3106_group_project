import React, { useState } from 'react';

function EditListing({ listing }) {
    const [title, setTitle] = useState(listing.title);
    const [description, setDescription] = useState(listing.description);
    const [price, setPrice] = useState(listing.price);

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission - send updated listing data to the server or update in application state
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input type="text" value={title} onChange={handleTitleChange} />
            </label>
            <label>
                Description:
                <textarea value={description} onChange={handleDescriptionChange} />
            </label>
            <label>
                Price:
                <input type="number" value={price} onChange={handlePriceChange} />
            </label>
            <button type="submit">Save Changes</button>
        </form>
    );
}

export default EditListing;