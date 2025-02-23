import React from 'react'
import styles from './Clients.module.css'
const Clients = () => {
  return (
    <div>
      <div className={styles.text}>
        <h3>For your <span className={styles.first}>physical health.</span>  For your <br /> <span className={styles.second}>mental health.</span>  For clinicians.  For <br /> <span className={styles.last}>hospitals.</span> For all of it in one place. For life.</h3>
      </div>
      <div className={styles.cards}>
        <div className={styles.firstCard}>
            <h3>Physical Health</h3>
            <p>Our platform offers a wide range of physical health services, including medical consultations, lab</p>
            <p>results, and medication management.</p>
        </div>
        <div className={styles.secondCard}>
            <h3>Mental Health</h3>
            <p>Our platform offers a wide range of mental health services, including therapy sessions, counseling</p>
            <p>and support groups.</p>
        </div>
        <div className={styles.lastCard}>
            <h3>Clinicians</h3>
            <p>Our platform offers a wide range of services for clinicians, including patient management, billing </p>
            <p>and practice management.</p>
        </div>
      </div>
      <div className={styles.aboutus}>
        <h3>A <span className={styles.first}>high-quality</span>  care experience — <span className={styles.second}>anywhere</span> , <span className={styles.last}>anytime</span> </h3>
        <div className={styles.btn}>Get Started</div>
      </div>
    </div>
  )
}

export default Clients
