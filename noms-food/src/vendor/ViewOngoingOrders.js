import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Container, Typography, TextField, Grid, Card, CardContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Link } from 'react-router-dom';

function ViewOngoingOrders() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (auth.currentUser) {
                const currentUserId = auth.currentUser.uid;

                // Query to get the vendor's details
                const userQuery = query(collection(db, 'User'), where('userID', '==', currentUserId));
                const userSnapshot = await getDocs(userQuery);
                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    const storeId = userData.storeId;

                    // Query to get the ongoing orders for the store
                    const ordersQuery = query(collection(db, 'Order'), where('storeID', '==', storeId), where('status', '==', 'ongoing'));
                    const ordersSnapshot = await getDocs(ordersQuery);

                    // Convert the snapshot to an array of order objects
                    const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setOrders(ordersData);
                    console.log(ordersData);

                }
            }
        };

        fetchOrders();
    }, [db, auth]);

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container
            maxWidth="sm"
            sx={{
                padding: '20px',
                height: '100vh',
                marginTop: '20px'
            }}>
            <Container maxWidth="sm"
                sx={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    marginTop: '55px'
                }}>
                <Typography variant="h4" gutterBottom>
                    Ongoing Orders
                </Typography>
                <TextField
                    label="Search by order ID"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />
                <Grid container spacing={3}>
                    {filteredOrders.map(order => (
                        <Grid item xs={12} sm={6} md={4} key={order.id}>
                            <OrderCard order={order} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Container>
    );
};


function OrderCard({ order }) {
    return (
        <Link to={`/order/${order.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Order ID: {order.id}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Store Name: {order.storeName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Store ID: {order.storeId}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Customer Name: {order.customerName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Customer ID: {order.customerId}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Total Price: {order.price}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Order Date: {order.date}
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Listing ID</TableCell>
                                    <TableCell>Listing Title</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.listingIDList.map((listingID, index) => (
                                    <TableRow key={listingID}>
                                        <TableCell>{listingID}</TableCell>
                                        <TableCell>{order.listingTitles[index]}</TableCell>
                                        <TableCell>{order.quantityList[index]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography variant="body1" color="textSecondary">
                        Store ID: {order.storeID}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
}

export default ViewOngoingOrders;