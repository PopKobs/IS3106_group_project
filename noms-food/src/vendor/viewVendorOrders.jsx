import React, { useEffect, useState } from 'react';
import { Typography, Container, Tab, Tabs, TabPanel, ListItem, ListItemText, Box, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, TableCell, TableRow, TableBody, TableHead, Table, Paper, TableContainer } from '@mui/material';
import { getFirestore, collection, query, getDocs, doc, getDoc, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getAuth } from 'firebase/auth';

const ViewVendorOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const [tabValue, setTabValue] = useState('active');

    useEffect(() => {
        fetchOrders();
    }, []);

    

    const fetchOrders = async () => {
        const auth = getAuth();
        const activeUser = auth.currentUser;
        if (!activeUser) {
            return;
        }
    
        try {
            const db = getFirestore();
            const userQuerySnapshot = await getDocs(query(collection(db, 'Users'), where('userId', '==', activeUser.uid)));
            const activeUserEmail = userQuerySnapshot.docs[0].data().email;
            
            const storeQuerySnapshot = await getDocs(query(collection(db, 'Store'), where('creatorEmail', '==', activeUserEmail)));
            const storeId = storeQuerySnapshot.docs[0].id;
            const ordersSnapshot = await getDocs(query(collection(db, 'Order'), where('storeId', '==', storeId)));
            const ordersData = ordersSnapshot.docs.map(async doc => {
                const orderData = doc.data();
                const storeName = await fetchStoreName(orderData.storeId);
                return { id: doc.id, ...orderData, storeName };
            });
            const resolvedOrdersData = await Promise.all(ordersData);
            setOrders(resolvedOrdersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Handle error
        }
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

    const handleOrderDetails = async (order) => {
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

    const filteredOrders = orders.filter(order => {
        if (tabValue === 'active') {
            return order.orderStatus === 'ongoing';
        } else if (tabValue === 'completed') {
            return order.orderStatus === 'completed';
        }
    }).sort((a, b) => {
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
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2, backgroundColor: 'white' }}>
                <Tabs
                    value={tabValue}
                    onChange={(event, newValue) => setTabValue(newValue)}
                    variant="fullWidth"
                    indicatorColor="secondary" 
                    textColor="secondary"
                >
                    <Tab value="active" label="Active Orders" />
                    <Tab value="completed" label="Completed Orders" />
                </Tabs>
            </Box>
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

export default ViewVendorOrders;