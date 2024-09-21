import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const isTokenValid = () => {
  const token = Cookies.get('token');

  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; 

    if (decoded.exp < currentTime) {
      Cookies.remove('token'); 
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
