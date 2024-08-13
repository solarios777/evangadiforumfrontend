import { useRef, useState } from "react";
import axios from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import Login from "../Login/Login";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const Register = () => {
  const navigate = useNavigate();
  const [signup, setsignup] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, seterror] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  

  const userNameDom = useRef();
  const firstNameDom = useRef();
  const lastNameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    const usernameValue = userNameDom.current.value;
    const firstnameValue = firstNameDom.current.value;
    const lastnameValue = lastNameDom.current.value;
    const emailValue = emailDom.current.value;
    const passwordValue = passwordDom.current.value;

    if (
      !usernameValue ||
      !firstnameValue ||
      !lastnameValue ||
      !emailValue ||
      !passwordValue
    ) {
      seterror("Please provide all required information");
      return;
    }

    try {
      const { data }  =await axios.post("/user/register/", {
        username: usernameValue,
        firstName: firstnameValue,
        lastName: lastnameValue,
        email: emailValue,
        password: passwordValue,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username)
      setSuccess("Registration successful. Please login.");
      navigate("/");
      setsignup(false);
    } catch (error) {
      seterror(error.response?.data?.msg || "An error occurred");
    }
  }

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    let strength = 0;
    const requirements = [];

    if (password.length >= 8) {
      strength++;
    } else {
      requirements.push("Password must be at least 8 characters long.");
    }

    if (/[a-z]/.test(password)) {
      strength++;
    } else {
      requirements.push("Password must contain at least one lowercase letter.");
    }

    if (/[A-Z]/.test(password)) {
      strength++;
    } else {
      requirements.push("Password must contain at least one uppercase letter.");
    }

    if (/\d/.test(password)) {
      strength++;
    } else {
      requirements.push("Password must contain at least one number.");
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength++;
    } else {
      requirements.push(
        "Password must contain at least one special character."
      );
    }

    setPasswordStrength(strength);
    setPasswordRequirements(requirements);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCreateAccount = () => {
    setsignup(false);
  };

  const isPasswordStrong = passwordStrength >= 5; 

  return (
    <div>
      {error && <div>{error}</div>}
      {signup ? (
        <section className={styles.registerSection}>
          <h2>Join the network</h2>
          <h3>
            Already have an account?{" "}
            <span>
              <Link to="#" onClick={handleCreateAccount}>
                Sign in
              </Link>
            </span>
          </h3>

          <form className={styles.registerForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                className={styles.formInput}
                type="text"
                name="username"
                ref={userNameDom}
                placeholder="Username"
              />
            </div>
            <div className={styles.formGroupName}>
              <div className={styles.formGroup}>
                <input
                  className={styles.formInput}
                  type="text"
                  name="firstName"
                  ref={firstNameDom}
                  placeholder="First Name"
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  className={styles.formInput}
                  type="text"
                  name="lastName"
                  ref={lastNameDom}
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <input
                className={styles.formInput}
                type="email"
                name="email"
                ref={emailDom}
                placeholder="Email"
              />
            </div>
            <div className={styles.passwordContainer}>
              <input
                className={styles.passwordInput}
                type={showPassword ? "text" : "password"}
                name="password"
                ref={passwordDom}
                placeholder="Password"
                onChange={handlePasswordChange}
              />
              <span
                onClick={toggleShowPassword}
                className={styles.passwordToggle}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            </div>
            {!isPasswordStrong && (
              <div className={styles.passwordStrengthContainer}>
                <PasswordStrengthIndicator
                  strength={passwordStrength}
                  passwordRequirements={passwordRequirements}
                />
              </div>
            )}
            <p>
              I agree to the <Link>privacy policy</Link> and{" "}
              <Link href="">terms of service</Link>
            </p>
            <button className={styles.registerButton} type="submit">
              Agree and Join
            </button>
            <div className={styles.loginLink}>
              <Link to="#" onClick={handleCreateAccount}>
                Already have an account?
              </Link>
            </div>
          </form>
        </section>
      ) : (
        <div>
          <Login />
        </div>
      )}
    </div>
  );
};

export default Register;