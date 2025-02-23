import React from 'react'
import styles from './Hero.module.css'
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        <div className={styles.general}>
            <div className={styles.navbar}>
                <div className={styles.left}>
                    <p>Individuals</p>
                    <p>Organizations</p>
                    <p>Clinics</p>
                </div>

                <div className={styles.middle}>
                    <p>MyDoc</p>
                </div>

                <div className={styles.right}>
                    <Link to='/register'>
                        <p>Sign in</p>
                    </Link>
                    <p>Register</p>
                </div>
            </div>
            <div className={styles.hero}>
                <div className={styles.text}>
                    <h3>One Click Away From <br /> Your Online Doctor</h3>
                    <p>Get Started</p>
                </div>
            </div>
        </div>

    )
}

export default Hero
