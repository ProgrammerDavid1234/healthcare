import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // ✅ Import Context
import styles from './Login.module.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);  // ✅ Use Context API
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await axios.post(
            'https://healthcare-backend-a66n.onrender.com/api/users/login',
            formData
        );

        console.log("Login Response:", response.data); // ✅ Debugging log

        // Check if user exists in response
        if (!response.data?.user) {
            throw new Error("User data not found in response");
        }

        setToken(response.data.token);
        setUser(response.data.user);

        toast.success(`Welcome, ${response.data.user.name}!`, { autoClose: 3000 });

        setTimeout(() => {
            navigate('/userdashboard');
        }, 3000);
    } catch (error) {
        console.error("Login Error:", error.response ? error.response.data : error);
        toast.error(error.response?.data?.message || "Login Failed!", { autoClose: 3000 });
    } finally {
        setLoading(false);
    }
};



  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <h2>MyDoc</h2>
      </div>
      <div className={styles.loginBox}>
        <h3>Welcome Back</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>Don't have an account? <Link to='/register'>Sign Up</Link></p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
