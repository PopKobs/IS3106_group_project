import db from "./firebase/firebase";
import logo from './logo.svg';
import './signup.css';
import { useNavigate } from "react-router-dom";

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

    const handleSignupLink = () => {
        navigate("/signup");
    }
    const handleCreateListing = () => {
        navigate("/createListing");
    }
    const handleAccountClick = () => {
      navigate("/login"); // Redirects user to the login page
    };

  return (
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
  );
};

export default LandingPage;
