import React, { useState } from 'react';

const OpenShop = () => {
    const [isShopOpen, setIsShopOpen] = useState(false);

    const handleOpenShop = () => {
        setIsShopOpen(true);
        // Additional logic to update the shop status in the backend can be added here
    };

    return (
        <div>
            <h1>Vendor Dashboard</h1>
            <button onClick={handleOpenShop}>Open Shop</button>
            {isShopOpen && <p>Your shop is now open and accepting orders!</p>}
        </div>
    );
};

export default OpenShop;