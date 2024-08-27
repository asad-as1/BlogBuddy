import React, { useEffect, useState } from 'react';
import { Container, LogoutBtn } from '../index';
import { useNavigate } from 'react-router-dom';
import Cookie from 'cookies-js';
import axios from 'axios';

function Header() {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState(false);
  const token = Cookie.get('token');

  useEffect(() => {
    if (token) {
      axios.get('/user/check-auth', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setAuthStatus(true); // User is authenticated
      })
      .catch(error => {
        setAuthStatus(false); // User is not authenticated
        console.error('Authentication check failed', error);
      });
    }
  }, [token]);

  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "Profile", slug: "/profile", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "Favourites", slug: "/user/favourites", active: authStatus },
  ];

  return (
    <header className='py-3 shadow bg-blue-950 text-white'>
      <Container>
        <nav className='flex items-center justify-around'>
          <ul className='flex'>
            {navItems.map((item) => 
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-block px-6 py-2 duration-200 hover:bg-blue-900 rounded-full'
                  >
                    {item.name}
                  </button>
                </li>
              )
            )}
            {authStatus && (
              <li>
                <LogoutBtn setAuthStatus={setAuthStatus} />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
