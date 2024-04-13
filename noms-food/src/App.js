// App.js
import React from "react";
import { useRoutes, useLocation } from "react-router-dom";
import LandingPage from './landingpage';
import Signup from './signup';
import CreateStore from './vendor/CreateStore';
import CreateListing from './vendor/CreateListing';
import ViewOwnListings from './vendor/ViewOwnListings';
import ViewOngoingOrders from './vendor/ViewOngoingOrders';
import ViewPastOrders from './vendor/ViewPastOrders';
import ViewStore from './vendor/ViewStore';
import EditStore from './vendor/EditStore';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/home/index";
import CustHome from "./components/home/customerHome";
import AdminHome from "./components/home/adminHome";
import Header from "./components/header/index";
import CustHeader from "./components/header/custHeader";
import AdminHeader from "./components/header/adminHeader";
import TicketForm from "./user/ReportIT";
import ViewITTickets from "./user/ViewITTickets";
import ProfilePage from './profilepage';
import EditProfile from './editprofile';
import ProfilePageCust from './profilepageCust';
import AccountType from "./components/auth/register/type";
import SearchStores from "./customer/searchStores"
import StoreListings from "./customer/viewStoreListing"
import CartView from "./customer/cart";
import AdminUsersPage from './admin/viewUser';
import CheckoutPage from "./customer/checkout";
import OrderConfirmed from "./customer/orderConfirmed";
import ViewStoreListings from "./customer/viewStoreListing";
import { AuthProvider } from "./contexts/authContext";
import { Container } from "@mui/material";

function App() {
  const location = useLocation(); // Get current location
  const custHeaderPages = ["/custHome", "/profilepageCust"]; // Pages for customers (using customer header)
  const isCustHeaderPage = custHeaderPages.includes(location.pathname); // Check if current page is a customer page
  const adminHeaderPages = ["/adminHome", "/adminviewuser"]; // Pages for admin
  const isAdminPage = adminHeaderPages.includes(location.pathname); // Check if current page is admin page

  const routes = useRoutes([
    { path: "/", element: <LandingPage /> },
    { path: "/signup", element: <Signup /> },
    { path: "/createstore", element: <CreateStore /> },
    { path: "/createlisting", element: <CreateListing /> },
    { path: "/viewownlistings", element: <ViewOwnListings /> },
    { path: "/viewongoingorders", element: <ViewOngoingOrders /> },
    { path: "/viewpastorders", element: <ViewPastOrders /> },
    { path: "/viewstore", element: <ViewStore /> },
    { path: "/editstore", element: <EditStore /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/type", element: <AccountType /> },
    { path: "/home", element: <Home /> },
    { path: "/custHome", element: <CustHome /> },
    { path: "/adminHome", element: <AdminHome /> },
    { path: "/reportItTicket", element: <TicketForm /> },
    { path: "/viewItTickets", element: <ViewITTickets />},
    { path: "/profilepage", element: <ProfilePage /> },
    { path: "/searchStores", element: <SearchStores /> },
    { path: "/store/:storeId", element: <StoreListings /> },
    { path: "/editprofile", element: <EditProfile /> },
    { path: "/adminviewuser", element: <AdminUsersPage /> },
    { path: "/profilepageCust", element: <ProfilePageCust /> },
    { path: "/viewCart/:storeId", element: <CartView /> },
    { path: "/checkout/:storeId", element: <CheckoutPage /> },
    { path: "/orderConfirmed/:storeId/:orderId", element: <OrderConfirmed /> },
    { path: "/store/:storeId", element: <ViewStoreListings /> }
    // Add more routes as needed
  ]);

  

  return (
    <AuthProvider>
        {isCustHeaderPage ? <CustHeader /> : (isAdminPage ? <AdminHeader /> : <Header />)}
        <Container maxWidth="xl">
          <div>{routes}</div>
        </Container>
    </AuthProvider>
  );
}

export default App;
