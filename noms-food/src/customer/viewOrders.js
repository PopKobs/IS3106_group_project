import React, { useEffect, useState } from 'react';
import { Typography, Container, List, ListItem, ListItemText, Box, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, TableCell, TableRow, TableBody, TableHead, Table, Paper, TableContainer } from '@mui/material';
import { getFirestore, collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const ViewAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const db = getFirestore();
        const ordersCollection = collection(db, 'Order');
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersData = ordersSnapshot.docs.map(async doc => {
            const orderData = doc.data();
            const storeName = await fetchStoreName(orderData.storeId);
            return { id: doc.id, ...orderData, storeName };
        });
        const resolvedOrdersData = await Promise.all(ordersData);
        setOrders(resolvedOrdersData);
    };

    const fetchStoreName = async (storeId) => {
        if (!storeId) {
            return 'Unknown Store';
        }
    
        try {
            const db = getFirestore();
            const storeDoc = await getDoc(doc(db, 'Store', storeId));
            
            if (storeDoc.exists()) {
                const storeData = storeDoc.data();
                return storeData.name;
            } else {
                return 'Unknown Store';
            }
        } catch (error) {
            console.error('Error fetching store name:', error);
            return 'Unknown Store';
        }
    };

    const handleListItemClick = async (order) => {
        await handleOrderDetails(order);
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    const handleOrderDetails = async(order) => {
        const orderItems = order.orderItems;
        const listingsData = [];
        for (const item of orderItems) {
            const listingDocRef = doc(db, 'Listing', item.listingId);
            const listingDocSnapshot = await getDoc(listingDocRef);
            const listingData = listingDocSnapshot.data();
            const itemBought = {
                itemId: listingDocSnapshot.id,
                itemTitle: listingData.title,
                itemQuantity: item.quantity,
                itemUnitPrice: item.price,
                itemTotalPrice: (item.price * item.quantity)
            };
            listingsData.push(itemBought);
        }
        console.log(listingsData);
        setOrderDetails(listingsData);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setOrderDetails([]);
        setSelectedOrder(null);
    };

    const filteredOrders = orders.filter(order => order.orderStatus == "ongoing")
    .sort((a, b) => {
           if (a.date > b.date) {
             return -1;
           } else if (a.date < b.date) {
             return 1;
           } else {
             return 0;
           }
         });

         return (
            <Container maxWidth="sm" style={{ marginTop: '50px' }}>
                <Typography variant="h4" gutterBottom>
                    All Orders
                </Typography>
                {orders.length > 0 ? (
                    <Box bgcolor="white" p={2} borderRadius={4}>
                        <Stack spacing={2}>
                            {filteredOrders.map(order => (
                                <Box key={order.id} bgcolor="white" borderRadius={4} boxShadow={1} onClick={() => handleListItemClick(order)} style={{ cursor: 'pointer' }}>
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                                    Order ID: {order.orderId.slice(-4)}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body1">
                                                    <strong>Store Name:</strong> {order.storeName}
                                                    <br />
                                                    <strong>Date:</strong> {order.date.toDate().toLocaleString('en-US', { timeZone: 'Asia/Singapore' })}
                                                    <br />
                                                    <span style={{ color: 'green', fontWeight: 'bold' }}>Status: {order.orderStatus}</span> 
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                ) : (
                    <Typography variant="body1">
                        No orders found.
                    </Typography>
                )}
                <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Order Details</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <>
                            <Typography><strong>Order ID:</strong> {selectedOrder.orderId.slice(-4)}</Typography>
                            <Typography><strong>Store Name:</strong> {selectedOrder.storeName}</Typography>
                            <Typography><strong>Status:</strong> {selectedOrder.orderStatus}</Typography>
                            <Typography><strong>Date:</strong> {selectedOrder.date.toDate().toLocaleString('en-US', { timeZone: 'Asia/Singapore' })}</Typography>
                            <Typography><strong>Order Details</strong></Typography>
                            <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderDetails.map((listing) => (
                                        <TableRow key={listing.itemId}>
                                            <TableCell>
                                                <Typography variant="body1">{listing.itemTitle}</Typography>
                                                <Typography variant="body2">Qty: {listing.itemQuantity}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body1">{listing.itemTotalPrice}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                            <Typography><strong>Total Price: {selectedOrder.orderPrice}</strong></Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ color: 'black' }}>
                        Close
                    </Button>
                </DialogActions>
                </Dialog>
            </Container>
        );
    };

export default ViewAllOrders;