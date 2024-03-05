import React, { useState } from 'react';

const EditShopDetails = () => {
    const [shopName, setShopName] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [shopDescription, setShopDescription] = useState('');

    const handleShopNameChange = (e) => {
        setShopName(e.target.value);
    };

    const handleShopAddressChange = (e) => {
        setShopAddress(e.target.value);
    };

    const handleShopDescriptionChange = (e) => {
        setShopDescription(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Perform API call to update shop details
        // Example code:
        // const updatedShopDetails = {
        //   name: shopName,
        //   address: shopAddress,
        //   description: shopDescription,
        // };
        // api.updateShopDetails(updatedShopDetails);

        // Reset form fields
        setShopName('');
        setShopAddress('');
        setShopDescription('');
    };

    return (
        <div>
            <h2>Edit Shop Details</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Shop Name:
                    <input type="text" value={shopName} onChange={handleShopNameChange} />
                </label>
                <br />
                <label>
                    Shop Address:
                    <input type="text" value={shopAddress} onChange={handleShopAddressChange} />
                </label>
                <br />
                <label>
                    Shop Description:
                    <textarea value={shopDescription} onChange={handleShopDescriptionChange} />
                </label>
                <br />
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditShopDetails;