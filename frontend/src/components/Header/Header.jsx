import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from "cookies-js";
import axios from "axios";
import { FaBars, FaSun, FaMoon } from "react-icons/fa";
import logo from "./image/logo.jpg";
import LogoutBtn from "./LogoutBtn";

function Header({ toggleDarkMode, isDarkMode }) {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = Cookie.get("token");
  const menuRef = useRef(null);

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

  const handleDarkModeToggle = () => {
    toggleDarkMode();
    Cookie.set("darkMode", !isDarkMode);
  };

  useEffect(() => {
    const darkModePreference = Cookie.get("darkMode");
    if (darkModePreference === "true") {
      toggleDarkMode(true);
    }
  }, []);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "Profile", slug: `/profile/${user?.username}`, active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "Search", slug: "/search", active: authStatus },
    { name: "Favourites", slug: "/user/favourites", active: authStatus },
  ];

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
                  <LogoutBtn setAuthStatus={setAuthStatus} />
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
                              className="block w-full px-4 py-2 rounded-full hover:bg-blue-900 text-left"
                            >
                              {item.name}
                            </button>
                          </li>
                        )
                    )}
                    {authStatus && (
                      <li className="mb-2">
                        <LogoutBtn setAuthStatus={setAuthStatus} />
                      </li>
                    )}
                    {/* Dark Mode Toggle Button Inside Menu */}
                    <li
                      onClick={() => {
                        handleDarkModeToggle();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center cursor-pointer justify-between px-4 py-2 hover:bg-blue-900 rounded-full w-full"
                    >
                      <span className="flex items-center w-full">
                        <span className="mr-2">
                          {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </span>
                        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
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
