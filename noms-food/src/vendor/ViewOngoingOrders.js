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

                // Query to get all orders for the user
                const ordersQuery = query(collection(db, 'Order'), where('vendorID', '==', currentUserId));
                const ordersSnapshot = await getDocs(ordersQuery);

                // Convert the snapshot to an array of order objects
                let ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log(ordersData[0]);

                // Filter the orders based on the search term
                if (searchTerm) {
                    ordersData = ordersData.filter(order => order.id.toLowerCase().includes(searchTerm.toLowerCase()));
                }

                const ordersDataWithDetails = await Promise.all(ordersData.map(async order => {
                    const customerName = await getCustomerName(db, order.customerID); 
                    return { ...order, customerName };
                }));

                setOrders(ordersDataWithDetails);
            }
        };

        fetchOrders();
    }, [db, auth, searchTerm]);

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
                        <Grid item xs={12} sm={12} md={6} key={order.id}>
                            <OrderCard order={order} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Container>
    );
};

async function getCustomerName(db, userId) {
    try {
        const userDoc = doc(db, 'Users', userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
            return userSnapshot.data().name;
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

function OrderCard({ order }) {
    const totalPrice = order.priceList.reduce((total, price, index) => total + price * order.quantityList[index], 0);

    return (
        <Link to={`/order/${order.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Order ID: {order.id}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Customer Name: {order.customerName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Total Price: {totalPrice}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Order Date: {new Date(order.date.seconds * 1000).toLocaleDateString()}
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Listing ID</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.listingIDList.map((listingID, index) => (
                                    <TableRow key={listingID}>
                                        <TableCell>{listingID}</TableCell>
                                        <TableCell>{order.quantityList[index]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Link>
    );
}

export default ViewOngoingOrders;