import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { useAuth } from './contexts/authContext';
import { doSignOut } from './firebase/auth';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const { userLoggedIn, currentUserEmail } = useAuth(); // Assuming you have a way to get the current user's email
  const email = currentUserEmail;
  console.log("Printing email " + email);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      const db = getFirestore();
      const usersRef = collection(db, "Users");
      console.log('Current User Email:', currentUserEmail);
      const q = query(usersRef, where("email", "==", currentUserEmail));

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // Assuming the first document is the user's data
          const userData = querySnapshot.docs[0].data();
          setUserData(userData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [userLoggedIn, currentUserEmail, navigate]);

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col justify-center items-center">
  {userData ? (
    <div className='max-w-md w-full space-y-4 bg-white shadow-lg rounded-lg p-6 border border-teal-200'>
      <h2 className="text-2xl font-semibold text-teal-800">User Profile</h2>
      <div className="space-y-1">
        <p className="text-gray-800"><span className="font-medium text-teal-600">Email:</span> {userData.email}</p>
        <p className="text-gray-800"><span className="font-medium text-teal-600">Name:</span> {userData.name}</p>
        <p className="text-gray-800"><span className="font-medium text-teal-600">Username:</span> {userData.username}</p>
        <p className="text-gray-800"><span className="font-medium text-teal-600">Contact:</span> {userData.contact}</p>
      </div>
      {/* Add more fields as needed */}
      <button 
        onClick={() => { doSignOut().then(() => { navigate('/login') }) }} 
        className='mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
      >
        Logout
      </button>
      {/* Back to Homepage Button */}
      <button 
            onClick={() => navigate('/home')}
            className='mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
          >
            Back to Homepage
          </button>
    </div>
  ) : (
    <p className="text-center text-lg text-teal-600">Loading user data...</p>
  )}
</div>


  );
};

export default ProfilePage;
