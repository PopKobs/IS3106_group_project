import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { Container, Grid, Typography, Card, CardContent, TextField, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const ViewPastOrders = ({ vendorStoreIDs }) => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const firestoreDb = db;
                const q = query(collection(db, 'Order'), where('status', '==', 'past'), where('storeID', 'in', vendorStoreIDs));
                const querySnapshot = await getDocs(q);
                const ordersData = await Promise.all(querySnapshot.docs.map(async doc => {
                    const orderData = doc.data();
                    const storeSnapshot = await getDoc(doc(firestoreDb, 'Store', orderData.storeID));
                    const storeData = storeSnapshot.data();
                    const userSnapshot = await getDoc(doc(firestoreDb, 'User', orderData.customerID));
                    const userData = userSnapshot.data();
                    const listingPromises = orderData.listingIDList.map(listingID => getDoc(doc(firestoreDb, 'Listing', listingID)));
                    const listingSnapshots = await Promise.all(listingPromises);
                    const listingTitles = listingSnapshots.map(snapshot => snapshot.data().title);
                    return { ...orderData, id: doc.id, storeName: storeData.name, customerName: userData.Name, listingTitles };
                }));
                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching past orders:', error);
            }
        };
        
        fetchOrders();
    }, [vendorStoreIDs]);

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
                        Store ID: {order.storeID}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Customer Name: {order.customerName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Customer ID: {order.customerID}
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

export default ViewPastOrders;