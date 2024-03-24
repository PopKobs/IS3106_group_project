// App.js
import React from "react";
import { useRoutes } from "react-router-dom";
import LandingPage from './landingpage';
import Signup from './signup';
import CreateListing from './vendor/CreateListing';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/home";
import Header from "./components/header";
import ProfilePage from './profilepage';
import { AuthProvider } from "./contexts/authContext";

function App() {
  const routes = useRoutes([
    { path: "/", element: <LandingPage /> },
    { path: "/signup", element: <Signup /> },
    { path: "/createlisting", element: <CreateListing /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
    { path: "/profilepage", element: <ProfilePage /> },
    // Add more routes as needed
  ]);

  return (
    <AuthProvider>
      <Header />
      <div>{routes}</div>
    </AuthProvider>
  );
}

export default App;
