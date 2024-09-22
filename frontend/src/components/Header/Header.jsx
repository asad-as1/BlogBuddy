import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from "cookies-js";
import axios from "axios";
import { FaBars, FaSun, FaMoon } from "react-icons/fa";
import logo from "./image/logo.jpg";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function Header({ toggleDarkMode, isDarkMode }) {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = Cookie.get("token");
  const menuRef = useRef(null); // Create a ref for the menu

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_URL}user/check-auth`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
          setAuthStatus(true);
        } catch (error) {
          setAuthStatus(false);
          console.error("Authentication check failed", error);
        }
      } else {
        setAuthStatus(false);
      }
    };

    checkAuth();
  }, [token]);

  // Handle dark mode toggle and store preference in cookies
  const handleDarkModeToggle = () => {
    toggleDarkMode();
    Cookie.set("darkMode", !isDarkMode);
  };

  useEffect(() => {
    const darkModePreference = Cookie.get("darkMode");
    if (darkModePreference === "true") {
      toggleDarkMode(true); // Set dark mode if cookie exists
    }
  }, []);

  const handleLogout = async () => {
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
        Cookie.expire("token");
        setAuthStatus(false);
        setUser(null);
        MySwal.fire({
          icon: 'success',
          title: 'Logged Out!',
          text: 'You have successfully logged out.',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate("/login");
        });
      } catch (error) {
        console.error("Failed to log out:", error);
        MySwal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: 'There was an error logging you out. Please try again.',
          confirmButtonText: 'Retry',
        });
      }
    }
  };

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "Profile", slug: `/profile/${user?.username}`, active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "Search", slug: "/search", active: authStatus },
    { name: "Favourites", slug: "/user/favourites", active: authStatus },
  ];

  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className="shadow bg-blue-950 text-white">
      <div className="container mx-auto px-4">
        <nav className="flex items-center lg:justify-around sm:justify-between max-sm:justify-between py-4">
          {/* Logo */}
          <img
            src={logo}
            className="h-12 rounded-full cursor-pointer"
            alt="Logo"
            onClick={() => navigate("/")}
          />
          <div className="flex items-center space-x-4">
            {/* Navigation Items for Larger Screens */}
            <ul className="hidden md:flex md:items-center space-x-4">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name}>
                      <button
                        onClick={() => navigate(item.slug)}
                        className="px-4 py-2 rounded-full hover:bg-blue-900 transition duration-300"
                      >
                        {item.name}
                      </button>
                    </li>
                  )
              )}
              {authStatus && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full hover:bg-red-700 transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              )}
              {/* Dark Mode Toggle Button for Large Screens */}
              <li>
                <button
                  onClick={handleDarkModeToggle}
                  className="flex items-center space-x-3 text-white p-3 rounded-full hover:bg-blue-900 transition duration-300"
                >
                  <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                  {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                </button>
              </li>
            </ul>

            {/* Hamburger Menu for Small Screens */}
            <div className="relative md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                <FaBars size={28} />
              </button>
              {isMenuOpen && (
                <div ref={menuRef} className="absolute top-12 right-0 w-48 bg-blue-950 rounded-lg shadow-lg z-10">
                  <ul className="p-2">
                    {navItems.map(
                      (item) =>
                        item.active && (
                          <li key={item.name} className="mb-2">
                            <button
                              onClick={() => {
                                navigate(item.slug);
                                setIsMenuOpen(false);
                              }}
                              className="block px-4 py-2 rounded-full hover:bg-blue-900 text-left"
                            >
                              {item.name}
                            </button>
                          </li>
                        )
                    )}
                    {authStatus && (
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 rounded-full hover:bg-red-700 text-left"
                        >
                          Logout
                        </button>
                      </li>
                    )}
                    {/* Dark Mode Toggle Button Inside Menu */}
                    <li
                      onClick={() => {
                        handleDarkModeToggle();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center cursor-pointer justify-between px-4 py-2 hover:bg-blue-900 rounded-full"
                    >
                      <span className="flex items-center">
                        <span className="mr-2">
                          {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </span>
                        {isDarkMode ? (
                          <FaSun size={20} />
                        ) : (
                          <FaMoon size={20} />
                        )}
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
