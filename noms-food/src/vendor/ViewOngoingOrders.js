import React, { useEffect, useState } from 'react';

const ViewOngoingOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch ongoing orders from the server
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders/ongoing');
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching ongoing orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h1>Ongoing Orders</h1>
            {orders.length === 0 ? (
                <p>No ongoing orders.</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order.id}>
                            <p>Order ID: {order.id}</p>
                            <p>Customer ID: {order.customerID}</p>
                            <p>Total Price: {order.price}</p>
                            <p>Order Date: {order.date}</p>
                            <p>Listing ID: {order.listingID}</p>
                            <p>Store ID: {order.storeID}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewOngoingOrders;