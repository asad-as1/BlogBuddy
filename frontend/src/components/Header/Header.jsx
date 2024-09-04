import React, { useEffect, useState } from "react";
import { Container } from "../index";
import { useNavigate } from "react-router-dom";
import Cookie from "cookies-js";
import axios from "axios";
import { FaBars } from "react-icons/fa";

function Header() {
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
    { name: "Favourites", slug: "/user/favourites", active: authStatus },
  ];

  return (
    <header className="shadow bg-blue-950 text-white">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Hamburger Menu for Small Screens */}
          <div className="relative w-full md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-3"
            >
              <FaBars size={28} />
            </button>
            {isMenuOpen && (
              <div className="absolute top-12 w-48 bg-blue-950 rounded-lg shadow-lg z-10">
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
                </ul>
              </div>
            )}
          </div>
          {/* Navigation Items */}
          <ul className="hidden md:flex md:items-center md:justify-center md:h-20 md:w-full">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name} className="mb-4 md:mb-0">
                    <button
                      onClick={() => navigate(item.slug)}
                      className="block px-4 py-2 rounded-full hover:bg-blue-900 text-center"
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
                  className="block px-4 py-2 rounded-full hover:bg-red-700 text-center"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
