import styles from "./Signup.module.css"; // Adjust if your CSS file is named differently

const PasswordStrengthIndicator = ({ strength, passwordRequirements }) => {
  const getIndicatorColor = () => {
    switch (strength) {
      case 1:
        return styles.red;
      case 2:
        return styles.orange;
      case 3:
        return styles.blue;
      case 4:
        return styles.blue;
      case 5:
        return styles.green;
      default:
        return styles.transparent;
    }
  };

  return (
    <div className={styles.passwordStrengthContainer}>
      <div
        className={`${styles.strengthIndicator} ${getIndicatorColor()}`}
        style={{ width: `${(strength / 5) * 100}%` }}
      />
      {passwordRequirements && passwordRequirements.length > 0 && (
        <ul className={styles.passwordRequirements}>
          {passwordRequirements.map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;