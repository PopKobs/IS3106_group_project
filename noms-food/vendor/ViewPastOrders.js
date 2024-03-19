import React, { useState, useEffect } from 'react';

const ViewPastOrders = () => {
    const [pastOrders, setPastOrders] = useState([]);

    useEffect(() => {
        // Fetch past orders from the server
        fetch('/api/past-orders')
            .then(response => response.json())
            .then(data => setPastOrders(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Past Orders</h1>
            {pastOrders.length === 0 ? (
                <p>No past orders found.</p>
            ) : (
                <ul>
                    {pastOrders.map(order => (
                        <li key={order.id}>
                            <p>Order ID: {order.id}</p>
                            <p>Customer: {order.customerName}</p>
                            <p>Items: {order.items.join(', ')}</p>
                            <p>Total: ${order.total}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewPastOrders;