import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const NavBar = () => {
  // states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileButtonsVisible, setIsProfileButtonsVisible] = useState(false);

  //get the token from localStorage
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const firstLetter = username ? username.charAt(0) : "";

  // Generate a random hex color
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const firstLetterStyle = {
    backgroundColor: getRandomColor(),
    color: "white",
    padding: "25px 28px",
    borderRadius: "50%",
    display: "inline-block",
    fontWeight: "bold",
    marginRight: "8px",
    cursor: "pointer",
  };

  // function to handle sign in btn
  const handleSignIn = () => {
    navigate("/login");
  };

  // function to handle hamburger
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileButtonsVisible(false);
  };

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // function to toggle profile buttons visibility
  const toggleProfileButtons = () => {
    setIsProfileButtonsVisible(!isProfileButtonsVisible);
  };

  return (
    <div className={styles.navbar}>
      {/* logo's container */}
      <div className={styles.navbarLogo}>
        <img
          src="https://www.evangadi.com/themes/humans//assets/images/misc/evangadi-logo-home.png"
          alt="Evangadi Logo"
        />
      </div>
      {/* hamburger container */}
      <div className={styles.hamburger} onClick={toggleMobileMenu}>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </div>

      {/* header's right side container */}
      <div
        className={`${styles.navbarRight} ${
          isMobileMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        {/* home and how it works btn container */}
       
          <div className={styles.navbarMenu}>
            <Link
              to="/"
              className={styles.navbarLink}
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="#"
              className={styles.navbarLink}
              onClick={toggleMobileMenu}
            >
              How it Works
            </Link>
          </div>
          {/* sign in btn container */}
          <div className={styles.navbarSignin}>
            {token ? (
              <div className={styles.container}>
                <div
                  className={styles.firstLetter}
                  style={firstLetterStyle}
                  onClick={toggleProfileButtons}
                >
                  {firstLetter}
                </div>
                {isProfileButtonsVisible && (
                  <div className={styles.profielbuttons}>
                    <button
                      className={styles.logoutButton}
                      onClick={handleLogout}
                    >
                      LOGOUT
                    </button>
                    <Link to={`/user/${username}`}>
                      <button className={styles.activityButton}>
                        Activities
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <button className={styles.signinButton} onClick={handleSignIn}>
                SIGN IN
              </button>
            )}
        
        </div>
      </div>
    </div>
  );
};

export default NavBar;