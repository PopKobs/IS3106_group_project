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
                            <p>Customer: {order.customerName}</p>
                            <p>Total Amount: {order.totalAmount}</p>
                            {/* Add more order details as needed */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewOngoingOrders;