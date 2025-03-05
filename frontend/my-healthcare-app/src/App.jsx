import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Heart, Activity, Calendar, Users, Phone, Mail, Menu, X, ChevronRight, ArrowRight
} from "lucide-react";

import "./App.css";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Services from "./Components/Services";
import Features from "./Components/Features";
import Testimonials from "./Components/Testimonials";
import CallToAction from "./Components/CallToAction";
import Footer from "./Components/Footer";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Homescreen from "./Components/UserDashboard/HomeScreen/Homescreen";
import AvailableDoctors from "./Components/UserDashboard/AvailableDoctors/AvailableDoctors";
import Appointments from "./Components/UserDashboard/Appointments/Appointments";
import Notifications from "./Components/UserDashboard/Notifications/Notifications";
import ProfilePage from "./Components/UserDashboard/ProfilePage/ProfilePage";
import MessagesPage from "./Components/UserDashboard/MessagesPage/MessagesPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white">
              <Navbar />
              <Hero />
              <Services />
              <Features />
              <Testimonials />
              <CallToAction />
              <Footer />
            </div>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userdashboard" element={<Homescreen />} />
        <Route path="/availabledoctors" element={<AvailableDoctors />} />
        <Route path="/appointment" element={<Appointments />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
