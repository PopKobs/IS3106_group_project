import db from "./firebase";
import logo from './logo.svg';
import './signup.css';

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

const Signup = () => {
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    username: "",
  });

  const currentUser = profile;



  const fetchExistingProfile = async (email) => {
    const db = getFirestore();

    try {
      const userCollectionRef = collection(db, "User");
      const userQuery = query(userCollectionRef, where("email", "==", email));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const existingProfile = userSnapshot.docs[0].data();
        setProfile(existingProfile);
      }
    } catch (error) {
      console.error("Error fetching existing user profile", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setProfile((prevProfile) => ({
        ...prevProfile,
        [name]: prevProfile[name].includes(value)
          ? prevProfile[name].filter((i) => i !== value)
          : [...prevProfile[name], value],
      }));
    } else {
      setProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }));
    }
  };

  const handleNewUser = async (profile) => {
    const db = getFirestore();

    try {
      const userCollectionRef = collection(db, "Users");
      await addDoc(userCollectionRef, profile);
      console.log("User profile added to database!");
    } catch (error) {
      console.error("Error adding user", error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleNewUser(profile);
      alert("You have successfully created this user!");
      setProfile({ email: "", name: "", username: "" }); // Reset profile to empty values
    } catch (error) {
      console.error("Error handling user profile:", error);
    }
  };

  return (
    <>
      <div className="profile-page-container">
        <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
            />
            </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
            />
            </div>
         
          <button type="submit">Set Up User. Sign up works</button>
        </form>
      </div>
     
    </>
  );
};

export default Signup;
