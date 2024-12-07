import React, { useState, useEffect } from "react";
import "./App.css";
import { Header, Footer } from "./components";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <main className="flex-grow mt-20">
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
