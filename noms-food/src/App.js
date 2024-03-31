// App.js
import React from "react";
import { useRoutes, useLocation } from "react-router-dom";
import LandingPage from './landingpage';
import Signup from './signup';
import CreateStore from './vendor/CreateStore';
import CreateListing from './vendor/CreateListing';
import ViewOwnListings from './vendor/ViewOwnListings';
import ViewStore from './vendor/ViewStore';
import EditStore from './vendor/EditStore';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/home/index";
import CustHome from "./components/home/customerHome";
import Header from "./components/header/index";
import CustHeader from "./components/header/custHeader";
import TicketForm from "./user/ReportIT";
import ProfilePage from './profilepage';
import ProfilePageCust from './profilepageCust';
import AccountType from "./components/auth/register/type";
import SearchStores from "./customer/searchStores"
import StoreListings from "./customer/viewStoreListing"
import { AuthProvider } from "./contexts/authContext";
import { Container } from "@mui/material";

function App() {
  const location = useLocation(); // Get current location
  const custHeaderPages = ["/custHome", "/profilepageCust"]; // Pages for customers (using customer header)
  const isCustHeaderPage = custHeaderPages.includes(location.pathname); // Check if current page is a customer page

  const routes = useRoutes([
    { path: "/", element: <LandingPage /> },
    { path: "/signup", element: <Signup /> },
    { path: "/createstore", element: <CreateStore /> },
    { path: "/createlisting", element: <CreateListing /> },
    { path: "/viewownlistings", element: <ViewOwnListings /> },
    { path: "/viewstore", element: <ViewStore /> },
    { path: "/editstore", element: <EditStore /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/type", element: <AccountType /> },
    { path: "/home", element: <Home /> },
    { path: "/custHome", element: <CustHome /> },
    { path: "/reportItTicket", element: <TicketForm /> },
    { path: "/profilepage", element: <ProfilePage /> },
    { path: "/searchStores", element: <SearchStores /> },
    { path: "/store/:storeId", element: <StoreListings /> },
    { path: "/profilepageCust", element: <ProfilePageCust /> },
    // Add more routes as needed
  ]);

  return (
    <AuthProvider>
      {isCustHeaderPage ? <CustHeader /> : <Header />}
      <Container maxWidth="xl">
        <div>{routes}</div>
      </Container>    
    </AuthProvider>
  );
}

export default App;
