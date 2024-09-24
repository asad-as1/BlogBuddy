import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'cookies-js';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'sweetalert2/dist/sweetalert2.min.css'; 

const MySwal = withReactContent(Swal);

function LogoutBtn({ setAuthStatus }) {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Red color for confirm button background
      cancelButtonColor: '#3085d6', // Blue color for cancel button background
      confirmButtonText: 'OK', // No need for custom HTML, rely on button color
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
          confirmButtonColor: '#3085d6', // Use color for the OK button
          confirmButtonText: 'OK', // Just use text, the button color will stand out
        }).then(() => {
          navigate('/login'); // Redirect to login page after confirmation
        });
      } catch (error) {
        console.error('Logout failed', error);
        MySwal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: 'There was an error logging you out. Please try again.',
          confirmButtonColor: '#d33', // Red button for retry
          confirmButtonText: 'Retry',
        });
      }
    }
  };

  return (
    <button
      className='inline-block px-6 py-2 duration-200 hover:bg-blue-900 rounded-full'
      onClick={logoutHandler}
    >Logout
    </button>
  );
}

export default LogoutBtn;
