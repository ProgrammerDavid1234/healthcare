import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
    const { user, token } = useContext(AuthContext);
    const [profile, setProfile] = useState({});
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        gender: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?._id) return;
            setLoading(true);
            try {
                const response = await axios.get("https://healthcare-backend-a66n.onrender.com/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
                setFormData({
                    name: response.data.name || "",
                    email: response.data.email || "",
                    phone: response.data.phone || "",
                    gender: response.data.gender || "",
                    password: "" // Keep empty for security
                });
            } catch (err) {
                setError("Failed to fetch profile");
            } finally {
                setLoading(false);
            }
        };
    
        fetchProfile();
    }, [user, token]);
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Submitting form data:", formData);
    
            const response = await axios.put("https://healthcare-backend-a66n.onrender.com/api/users/update", formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
    
            console.log("Update successful:", response.data);
            alert("Profile updated successfully");
        } catch (err) {
            console.error("Update error:", err.response ? err.response.data : err.message);
            alert(`Failed to update profile: ${err.response?.data?.message || "Server error"}`);
        }
    };
    

    return (
        <div className={styles.profilePage}>
            <Sidebar />
            <div className={styles.content}>
                <h2>User Profile</h2>
                {loading ? (
                    <p>Loading profile...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : (
                    <div className={styles.profileContainer}>
                        <form onSubmit={handleSubmit} className={styles.profileForm}>
                            <label>Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} />

                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />

                            <label>Phone:</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

                            <label>Gender:</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>

                            <label>Password:</label>
                            <input type="password" name="password" placeholder="New Password" onChange={handleChange} />

                            <button type="submit">Update Profile</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
