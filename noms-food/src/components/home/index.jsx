import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Home = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <div className='text-2xl font-bold pt-14'>
            Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
            <button
                onClick={() => navigate('/createlisting')} // Use navigate to go to the Create Listing page
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Go to Create Listing
            </button>
        </div>
    );
};

export default Home;
