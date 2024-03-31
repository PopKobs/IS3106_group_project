import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import icon from '../../photo/noms_icon.png'

const CustHeader = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    return (
        <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200'>
            {/* Icon */}
            <img src={icon} alt="icon" className="w-8 h-8 ml-2" />
            {
                userLoggedIn
                    ?
                    <>
                        <button
                            onClick={() => navigate('/profilepageCust')}
                            className='p-1 rounded-full hover:bg-gray-300'>
                            <i className="fas fa-user-circle text-xl"></i> {/* Font Awesome User Icon */}
                        </button>
                        <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} >
                            LOGOUT

                        </button>
                        <button
                            onClick={() => navigate('/custHome')}>
                            HOMEPAGE
                        </button>
                    </>
                    :
                    <>
                        <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
                        <Link className='text-sm text-blue-600 underline' to={'/type'}>Register New Account</Link>
                    </>
            }

        </nav>
    )
}

export default CustHeader