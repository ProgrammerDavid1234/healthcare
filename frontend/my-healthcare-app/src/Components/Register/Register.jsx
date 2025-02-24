import React, { useState } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import styles from './Register.module.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();  // ✅ Initialize navigate

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    phone: '',
    role: 'patient'
  });

  const [loading, setLoading] = useState(false);  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  

    try {
      const response = await axios.post('https://healthcare-backend-a66n.onrender.com/api/users/register', formData);
      
      toast.success(response.data.message || 'User Registered Successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });

      setTimeout(() => {
        navigate('/login');  // ✅ Redirect to login page after 3 seconds
      }, 3000);  

      setFormData({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: '',
        phone: '',
        role: 'patient'
      });
    } catch (error) {
      console.error("Registration Error:", error);
      
      toast.error(error.response?.data?.message || 'Registration Failed!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <h2>MyDoc</h2>
      </div>
      <div className={styles.registerBox}>
        <h3>Let's Get Started</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className={styles.login}>
          <p>Have an Account with MyDoc? <Link to='/login'>Login</Link> </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;
