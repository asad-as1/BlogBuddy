import React from "react";
import "./App.css";
import { Header, Footer } from "./components";
import { Outlet } from "react-router-dom";

function App() {
  return(
  <div
    className="min-h-screen flex flex-wrap content-betweenn bg-gray-400">
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
