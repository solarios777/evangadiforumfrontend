import styles from "./About.module.css";
const About = () => {
  return (
    <div className={styles.container}>
      <div className={styles.rightSection}>
        <div className={styles.aboutTitle}>About</div>
        <div className={styles.networkName}>Evangadi Networks</div>
        <div className={styles.aboutText}>
          No matter what stage of life you are in, whether you’re just starting
          elementary school or being promoted to CEO of a Fortune 500 company,
          you have much to offer to those who are trying to follow in your
          footsteps.
        </div>
        <div className={styles.aboutText}>
          Whether you are willing to share knowledge or you are just looking to
          meet mentors of your own, please start by joining the network here.
        </div>
        <button className={styles.howitworks}>HOW IT WOKS</button>
      </div>
    </div>
  );
};

export default About;