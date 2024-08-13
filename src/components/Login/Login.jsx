import { useRef, useState } from "react";
import axios from "../../utils/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "./Login.module.css";
import Register from "../Signup/Signup";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailDom = useRef();
  const passwordDom = useRef();
  const [error, setError] = useState(null);
  const [signin, setsignin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = () => {
    setError(null);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const emailValue = emailDom.current.value;
    const passwordValue = passwordDom.current.value;
    if (!emailValue || !passwordValue) {
      setError("Please provide all required information");
      return;
    }

    try {
      const { data } = await axios.post("/user/login", {
        email: emailValue,
        password: passwordValue,
      });
      
      setError(null);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username)
      localStorage.setItem("remaining", data.remainingAttempts);

      // Redirect to the page user tried to access or home page
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setError("Too many requests, please try again after 10 MIN");
      } else {
        setError(error.response?.data?.msg || "An error occurred");
      }
    }
  }

  const handleCreateAccount = () => {
    setsignin(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      {signin ? (
        <div className={styles.loginContainer}>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <h2>Login to your account</h2>
            <p>
              Don't have an account?{" "}
              <Link to="#" onClick={handleCreateAccount}>
                Create a new account
              </Link>
            </p>

            <div className={styles.formGroup}>
              <input
                className={styles.emailInput}
                type="email"
                name="email"
                ref={emailDom}
                onChange={handleChange}
                placeholder="Email address"
              />
            </div>
            <div className={styles.passwordContainer}>
              <input
                className={styles.passwordInput}
                type={showPassword ? "text" : "password"}
                name="password"
                ref={passwordDom}
                onChange={handleChange}
                placeholder="Password"
              />
              <span
                onClick={toggleShowPassword}
                className={styles.passwordToggle}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            </div>
            <p className={styles.forget}>
              <Link to="#">Forgot password?</Link>
            </p>
            <button className={styles.submitButton} type="submit">
              Login
            </button>
            {error && <h3 className={styles.errorMessage}>{error}</h3>}
          </form>
        </div>
      ) : (
        <Register toggleForm={() => setsignin(true)} />
      )}
    </div>
  );
};

export default Login;