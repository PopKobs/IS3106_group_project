import db from "./firebase/firebase";
import logo from './logo.svg';
import './signup.css';
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from '@mui/material';
import background from "./photo/noms_background.jpg"
import { doSignOut } from "./firebase/auth.js";

import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";

/* TODO: Below buttons are only for testing, since login must occur first */

const LandingPage = () => {
  const navigate = useNavigate();

  /*const handleSignupLink = () => {
      navigate("/signup");
  }
  const handleCreateListing = () => {
      navigate("/createListing");
  }
  const handleAccountClick = () => {
    navigate("/login"); // Redirects user to the login page
  };*/

  useEffect(() => {
    doSignOut();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center', // Center items vertically
        justifyContent: 'center', // Center items horizontally
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
          borderRadius: '8px', // Rounded corners
          padding: '2rem', // Add padding
        }}
      >
        <Typography variant="h2">Welcome to NOMs</Typography>
        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>This is your beautiful website</Typography>
      </Container>
    </Box>
  );
};

export default LandingPage;


/*
<div className="container">
      <div>
        <button onClick={handleSignupLink}>
            Sign up now
        </button>
      </div>

      <div>
        <button onClick={handleCreateListing}>
            Create Listing Page
        </button>
      </div>

      <div>
        <button onClick={handleAccountClick}>
            Account
        </button>
      </div>
     
    </div>
*/