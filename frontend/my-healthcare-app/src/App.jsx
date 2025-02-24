import React from "react";
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./Components/Hero/Hero";
import Clients from "./Components/Clients/Clients";
import Features from "./Components/Features/Features";
import Footer from "./Components/Footer/Footer";
import Register from "./Components/Register/Register"; // Import Register Page
import Login from "./Components/Login/Login";
import Homescreen from "./Components/UserDashboard/HomeScreen/Homescreen";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Clients />
            <Features />
            <Footer />
          </>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userdashboard" element={<Homescreen />} />


      </Routes>
    </Router>
  );
};

export default App;
