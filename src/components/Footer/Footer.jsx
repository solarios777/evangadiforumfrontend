

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.logo}>
          <img
            src="https://www.evangadi.com/themes/humans/assets/hammerlook/img/misc/evangadi-logo-white.png"
            alt="Logo"
            className={styles.logo}
          />

          <div className={styles.social}>
            <Link
              to="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
            >
              <FaFacebook size={20} />
            </Link>
            <Link
              to="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
            >
              <FaInstagram size={20} />
            </Link>
            <Link
              to="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
            >
              <FaYoutube size={20} />
            </Link>
          </div>
        </div>
        <div className={styles.links}>
          <h2>Useful Links</h2>
          <Link className={styles.bottomLinks}>How it works</Link>
          <Link className={styles.bottomLinks}>Terms of Service</Link>
          <Link className={styles.bottomLinks}>Privacy Policy</Link>
        </div>

        <div className={styles.contact}>
          <h2>Contact Info</h2>
          <Link className={styles.bottomLinks}>Evangadi Networks</Link>
          <Link className={styles.bottomLinks}>support@ev.com</Link>
          <Link className={styles.bottomLinks}>+1-202-386-2702</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;


