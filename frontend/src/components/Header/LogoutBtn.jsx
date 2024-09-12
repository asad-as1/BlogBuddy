import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'cookies-js';

function LogoutBtn({ setAuthStatus }) {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_URL}user/logout`, {
        withCredentials: true, // Include cookies in the request
    });
      Cookie.expire('token'); // Remove the token cookie
      setAuthStatus(false); // Update auth status in Header
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <button
      className='inline-block px-6 py-2 duration-200 hover:bg-blue-900 rounded-full'
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
