import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from "cookies-js";
import axios from "axios";
import { FaBars, FaSun, FaMoon } from "react-icons/fa";
import logo from "./image/logo.jpg";

function Header({ toggleDarkMode, isDarkMode }) {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = Cookie.get("token");

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await axios.get("/user/check-auth", {
            headers: { Authorization: `Bearer ${token}` },
          });
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

  useEffect(() => {
    if (authStatus) {
      const fetchUserData = async () => {
        try {
          const res = await axios.get("http://localhost:5000/user/profile", {
            withCredentials: true,
          });
          setUser(res.data.user);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };
      fetchUserData();
    } else {
      setUser(null);
    }
  }, [authStatus]);

  // Handle dark mode toggle and store preference in cookies
  const handleDarkModeToggle = () => {
    toggleDarkMode();
    Cookie.set("darkMode", !isDarkMode);
    // window.location.reload(); // Refresh page to apply theme change
  };

  useEffect(() => {
    const darkModePreference = Cookie.get("darkMode");
    if (darkModePreference === "true") {
      toggleDarkMode(true); // Set dark mode if cookie exists
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/user/logout", {
        withCredentials: true,
      });
      Cookie.expire("token");
      setAuthStatus(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
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
                <div className="absolute top-12 right-0 w-48 bg-blue-950 rounded-lg shadow-lg z-10">
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
