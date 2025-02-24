import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';  // ✅ Import Context

const Homescreen = () => {
  const { user } = useContext(AuthContext);  // ✅ Get user data

  return (
    <div>
      <h1>{user ? `Welcome, ${user.name}!` : "Loading your dashboard..."}</h1>
      <p>Manage appointments, medical history, and more.</p>
    </div>
  );
};

export default Homescreen;
