// App.js
import React from "react";
import { useRoutes } from "react-router-dom";
import LandingPage from './landingpage';
import Signup from './signup';
import CreateStore from './vendor/CreateStore';
import CreateListing from './vendor/CreateListing';
import ViewOwnListings from './vendor/ViewOwnListings';
import ViewStore from './vendor/ViewStore';
import EditStore from './vendor/EditStore';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/home";
import Header from "./components/header";
import TicketForm from "./user/ReportIT";
import StoreListings from "./customer/searchStores";
import ProfilePage from './profilepage';
import AccountType from "./components/auth/register/type";
import { AuthProvider } from "./contexts/authContext";
import { Container } from "@mui/material";

function App() {
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
    { path: "/reportItTicket", element: <TicketForm /> },
    { path: "/storeListing", element:<StoreListings />},
    { path: "/profilepage", element: <ProfilePage /> },
    // Add more routes as needed
  ]);

  return (
    <AuthProvider>
      <Header />
      <Container>
        <div>{routes}</div>
      </Container>    
    </AuthProvider>
  );
}

export default App;
