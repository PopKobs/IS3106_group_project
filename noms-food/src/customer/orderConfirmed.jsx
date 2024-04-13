import React, { useEffect } from 'react';
import { Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getFirestore } from 'firebase/firestore';

const OrderConfirmed = () => {
    const { storeId, orderId } = useParams();
    const cartItemsKey = `cartItems_${storeId}`;

    useEffect(() => {
        const storedCartItems = sessionStorage.getItem(cartItemsKey);
        console.log(storedCartItems);
        const orderDetails = JSON.parse(storedCartItems);
        const orderItems = orderDetails.map(item => ({
            listingId: item.id,
            price: item.unitPrice,
            quantity: item.quantity,
        }));

        console.log(storeId);

        const currentTime = new Date();

        const auth = getAuth(); // Get Current User State
        const currentUser = auth.currentUser;

        const totalPrice = orderDetails.reduce((total, item) => total + item.price, 0);

        if (orderDetails && orderDetails.length > 0){
            const newOrderPayload = {
                customerId: currentUser.uid,
                date: currentTime,
                orderItems: orderItems,
                orderStatus: "ongoing",
                orderPrice: totalPrice,
                storeId: storeId,
                orderId: orderId
            }

            console.log(newOrderPayload);

            const db = getFirestore();
            try {
                addDoc(collection(db, 'Order'), newOrderPayload);
                console.log("Done")
            } catch (error) {
                console.error('Error adding order', error);
            }

            sessionStorage.setItem(cartItemsKey, JSON.stringify([]))
        }
    }, []);


    return (
        <Container maxWidth="sm" style={{ marginTop: '50px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Order Confirmed!
            </Typography>
            <Typography variant="body1" paragraph>
                Thank you for your order. Your payment has been successfully processed and your order is confirmed.
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/searchStore">
                Continue Shopping
            </Button>
        </Container>
    );
};

export default OrderConfirmed;