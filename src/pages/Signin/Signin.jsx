import { useState } from "react";
import Login from "../../components/Login/Login";
import Signup from "../../components/Signup/Signup";
import styles from "./Signin.module.css";
import About from "../../components/About/About";

const Signin = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={styles.container}>
      <div className={styles.rightSection}>
        <div>
          {isLogin ? (
            <Login toggleForm={toggleForm} />
          ) : (
            <Signup toggleForm={toggleForm} />
          )}
        </div>
      </div>

      <div className={styles.leftSection}>
        <About />
      </div>
    </div>
  );
};

export default Signin;