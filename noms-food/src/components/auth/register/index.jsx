import React, { useState, useEffect } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import { collection, addDoc, getFirestore } from "firebase/firestore"

const Register = () => {

    const [profile, setProfile] = useState({
        email: "",
        name: "",
        username: "",
        contact: "", // Added contact (phone number) field
        type: "", // Added account type field
      });

    const [accType, setAccType] = useState(''); // User account type

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    // Load data from sessionStorage when component mounts
    useEffect(() => {
        const storedData = sessionStorage.getItem('accType');
        if (storedData) {
          setAccType(storedData);
          setProfile(prevProfile => ({
            ...prevProfile,
            type: storedData // Set profile.type here
          }));
        }
      }, []);

  const handleNewUser = async () => {
    const db = getFirestore();
    try {
      const userCollectionRef = collection(db, "Users");
      await addDoc(userCollectionRef, profile);
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
                await doCreateUserWithEmailAndPassword(email, password);
                await handleNewUser(profile);
                setIsRegistering(false);
                //navigate("/home");
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
            {userLoggedIn && !isRegistering && (<Navigate to={'/home'} replace={true} />)}

            <main className="w-full h-screen flex self-center place-content-center place-items-center">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                    <div className="text-center mb-6">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Create a New Account</h3>
                        </div>

                    </div>
                    <form
                        onSubmit={onSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email} onChange={(e) => { setEmail(e.target.value); setProfile((prevState) => ({
                                    ...prevState,
                                    email: e.target.value
                                })) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Name
                            </label>
                            <input
                                required
                                value={profile.name} onChange={(e) => { setProfile((prevState) => ({
                                    ...prevState,
                                    name: e.target.value
                                })) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Username
                            </label>
                            <input
                                required
                                value={profile.username} onChange={(e) => { setProfile((prevState) => ({
                                    ...prevState,
                                    username: e.target.value
                                })) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Contact
                            </label>
                            <input
                                required
                                value={profile.contact} onChange={(e) => { setProfile((prevState) => ({
                                    ...prevState,
                                    contact: e.target.value
                                })) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Password
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password} onChange={(e) => { setPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Confirm Password
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='off'
                                required
                                value={confirmPassword} onChange={(e) => { setconfirmPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <div className="text-sm text-center">
                            Already have an account? {'   '}
                            <Link to={'/login'} className="text-center text-sm hover:underline font-bold">Continue</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register