// App.js
import React from "react";
import { useRoutes, useLocation } from "react-router-dom";
import LandingPage from './landingpage';
import Signup from './signup';
import CreateStore from './vendor/CreateStore';
import CreateListing from './vendor/CreateListing';
import ViewStore from './vendor/ViewStore';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/home/index";
import CustHome from "./components/home/customerHome";
import Header from "./components/header/index";
import CustHeader from "./components/header/custHeader";
import TicketForm from "./user/ReportIT";
import StoreListings from "./customer/searchStores";
import ProfilePage from './profilepage';
import ProfilePageCust from './profilepageCust';
import AccountType from "./components/auth/register/type";
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
    { path: "/viewstore", element: <ViewStore />},
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/type", element: <AccountType /> },
    { path: "/home", element: <Home /> },
    { path: "/custHome", element: <CustHome /> },
    { path: "/reportItTicket", element: <TicketForm /> },
    { path: "/storeListing", element:<StoreListings />},
    { path: "/profilepage", element: <ProfilePage /> },
    { path: "/profilepageCust", element: <ProfilePageCust /> },
    // Add more routes as needed
  ]);

  return (
    <AuthProvider>
      {isCustHeaderPage ? <CustHeader /> : <Header />}
      <Container>
        <div>{routes}</div>
      </Container>    
    </AuthProvider>
  );
}

export default App;
