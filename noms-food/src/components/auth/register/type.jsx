import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'


const AccountType = () => {
    
    const [accType, setAccType] = useState(''); // User account type
    const navigate = useNavigate();

    const updateSessionStorage = (key, value) => {
        sessionStorage.setItem(key, value); // Temporarily store user account type
      };

    const handleVendor = () => {
        setAccType('Vendor');
        updateSessionStorage('accType', 'Vendor');
        register();
    }
    const handleCustomer = () => {
        setAccType('Customer');
        updateSessionStorage('accType', 'Customer');
        register();
    }
    const register = () => {
      navigate("/register"); // Redirects user to register
    };

  return (
    <div className="container">
        <div>
            Registering As:
        </div>
      <div>
        <button onClick={handleVendor}>
            Vendor
        </button>
      </div>

      <div>
        <button onClick={handleCustomer}>
            Customer
        </button>
      </div>
     
    </div>
  );
};

export default AccountType;