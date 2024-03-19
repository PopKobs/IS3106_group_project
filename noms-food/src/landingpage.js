import db from "./firebase";
import logo from './logo.svg';
import './signup.css';
import { useHistory } from "react-router-dom";

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

const LandingPage = () => {
    const history = useHistory();

    const handleSignupLink = () => {
        history.push("/signup");
    }
    const handleCreateListing = () => {
        history.push("/createListing");
    }
    

  return (
    <>
      <div>
        <button onClick={handleSignupLink}>
            Sign up
        </button>
      </div>

      <div>
        <button onClick={handleCreateListing}>
            Create Listing Page
        </button>
      </div>
     
    </>
  );
};

export default LandingPage;
