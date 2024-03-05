import React, { useState } from 'react';

const DeleteListing = () => {
    const [listingId, setListingId] = useState('');

    const handleDelete = () => {
        // Perform the delete operation using the listingId
        // You can make an API call to delete the listing from the server

        // Example API call using fetch:
        fetch(`/api/listings/${listingId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                console.log('Listing deleted successfully');
            })
            .catch(error => {
                // Handle any errors that occurred during the delete operation
                console.error('Error deleting listing:', error);
            });
    };

    return (
        <div>
            <h2>Delete Listing</h2>
            <label htmlFor="listingId">Listing ID:</label>
            <input
                type="text"
                id="listingId"
                value={listingId}
                onChange={e => setListingId(e.target.value)}
            />
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default DeleteListing;