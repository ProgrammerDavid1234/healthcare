import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* Left Section - Company Info */}
        <div className={styles.section}>
          <h3>MyDoc</h3>
          <p>Your trusted telehealth platform, providing quality healthcare services anytime, anywhere.</p>
        </div>

        {/* Middle Section - Quick Links */}
        <div className={styles.section}>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Our Services</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faq">FAQs</a></li>
          </ul>
        </div>

        {/* Right Section - Contact & Socials */}
        <div className={styles.section}>
          <h3>Contact</h3>
          <p>Email: support@mydoc.com</p>
          <p>Phone: +1 234 567 890</p>
          <div className={styles.socials}>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} MyDoc. All Rights Reserved.</p>
      </div>
      
    </footer>
  );
}

export default Footer;
