import React, { useState, useEffect } from 'react';
import styles from './Features.module.css';

const Features = () => {
  const messages = [
    "You'll Find Us In More Than 600 U.S Hospitals",
    "You can start using the software anywhere",
    "A high-quality care experience anywhere, anytime"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % messages.length); // Loop through messages
    }, 5000);

    return () => clearInterval(interval); // Cleanup when component unmounts
  }, []);

  return (
    <div>
      <div className={styles.container}>
        <p key={index} className={styles.fadeIn}>{messages[index]}</p>
      </div>
    </div>
  );
}

export default Features;
