import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'cookies-js';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function LogoutBtn({ setAuthStatus }) {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'No, stay logged in!',
    });

    if (result.isConfirmed) {
      try {
        await axios.post(`${import.meta.env.VITE_URL}user/logout`, {
          withCredentials: true,
        });
        Cookie.expire('token'); // Remove the token cookie
        setAuthStatus(false); // Update auth status in Header
        MySwal.fire({
          icon: 'success',
          title: 'Logged Out!',
          text: 'You have successfully logged out.',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/login'); // Redirect to login page after confirmation
        });
      } catch (error) {
        console.error('Logout failed', error);
        MySwal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: 'There was an error logging you out. Please try again.',
          confirmButtonText: 'Retry',
        });
      }
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
