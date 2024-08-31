import React from "react";
import "./App.css";
import { Header, Footer } from "./components";
import { Outlet } from "react-router-dom";

function App() {
  return(
  <div
    className="min-h-screen flex flex-wrap content-between bg-gradient-to-r from-blue-100 to-purple-300">
    <div className="w-full block">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  </div>
)}

export default App;
