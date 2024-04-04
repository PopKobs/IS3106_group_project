import React, { useState, useEffect } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import { collection, addDoc, getFirestore } from "firebase/firestore"
import { getAuth } from 'firebase/auth';
import { Button, Container, Typography, TextField } from '@mui/material';

// TO Do: Error handle weak password and others
// To do: fix ui
const GRegister = () => {


    const [profile, setProfile] = useState({
        email: "",
        name: "",
        username: "",
        contact: "", // Added contact (phone number) field
        storeId: "",
        type: "", // Added account type field
        
      });

    const [accType, setAccType] = useState(''); // User account type

    const navigate = useNavigate()

    const [email, setEmail] = useState('')

    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [userIden, setIden] = useState('')

    const { userLoggedIn, currentUserEmail } = useAuth()
    const auth = getAuth();

    // Load data from sessionStorage when component mounts
    useEffect(() => {
        const storedData = sessionStorage.getItem('accType');
        setIden(auth.currentUser?.uid); // UserId for association
        if (storedData) {
          setAccType(storedData);
          setProfile(prevProfile => ({
            ...prevProfile,
            email: currentUserEmail,
            type: storedData, // Set profile.type here
            
          }));
        }
      }, []);

  const handleNewUser = async (userId) => {
    const db = getFirestore();
    
    try {

      const userCollectionRef = collection(db, "Users");
      await addDoc(userCollectionRef, { ...profile, userId });
      console.log("User profile added to database!");
      alert("You have successfully created this user!");
      setProfile({ email: "", name: "", username: "", contact: "" }); // Reset profile
    } catch (error) {
      console.error("Error adding user", error);
      throw error;
    }
  };

    const onSubmit = async (e) => {
        e.preventDefault()
        if(!isRegistering) {
            setIsRegistering(true);
            console.log("The Account Type: ")
            console.log(accType)
            try {

                await handleNewUser(userIden);
                setIsRegistering(false);
                //navigate("/home");
                if (accType=="Vendor") {
                    navigate("/home");
                } else {
                    navigate("/custHome");
                }
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    setErrorMessage('Email address is already in use.');
                } else {
                    // Handle other authentication errors
                    console.error('Error creating user:', error);
                    setErrorMessage('An error occurred. Please try again later.');
                }
                setIsRegistering(false);
                return; // Exit early to prevent further execution
            }
            
        }
    }

    return (
        <>

        <Container maxWidth="sm" sx={{ backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '1rem' }}>
            Create a New Account
          </Typography>
          <form onSubmit={onSubmit} className="space-y-4">
           
            <TextField
              label="Name"
              type="name"
              autoComplete="name"
              required
              value={profile.name}
              onChange={(e) => setProfile(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: '1rem' }}
            />
            <TextField
              label="Username"
              type="username"
              autoComplete="username"
              required
              value={profile.username}
              onChange={(e) => setProfile(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: '1rem' }}
            />
            <TextField
              label="Contact"
              type="contact"
              autoComplete="contact"
              required
              value={profile.contact}
              onChange={(e) => setProfile(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: '1rem' }}
            />

            <Button
              type="submit"
              disabled={isRegistering}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginBottom: '1rem' }}
            >
              {isRegistering ? 'Signing Up...' : 'Sign Up'}
            </Button>
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Link to={'/login'} className="text-center text-sm hover:underline font-bold">
                Continue
              </Link>
            </Typography>
          </form>
        </div>
      </Container>
            
        </>
    )
}
            

export default GRegister

