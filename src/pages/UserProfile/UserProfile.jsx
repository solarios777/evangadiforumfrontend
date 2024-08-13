import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams(); 
    const location = useLocation();
    const token = localStorage.getItem("token");
  const { firstname, lastname, email } = location.state || {};

  const [profile, setProfile] = useState({
    firstname: firstname || "",
    lastname: lastname || "",
    email: email || "",
    phone: "",
    address: "",
    gender: "male",
    profile_picture: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch user profile data from the server using the username
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/user/userprofile/${username}`);
        setProfile((prev) => ({
          ...prev,
          ...data, // Spread the fetched data to update the profile state
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load user profile.");
      }
    };

    fetchProfile();
  }, [username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfile((prev) => ({ ...prev, profile_picture: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("firstname", profile.firstname);
    formData.append("lastname", profile.lastname);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);
    formData.append("address", profile.address);
    formData.append("gender", profile.gender);
    if (profile.profile_picture) {
      formData.append("profile_picture", profile.profile_picture);
    }

    try {
      await axios.post(`/api/user/userprofile/${username}/update`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
        },
      });
      setSuccess("Profile updated successfully.");
      navigate("/home");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.msg || "An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>User Profile</h3>
        <ul className={styles.sidebarList}>
          <li>Activities</li>
          <li onClick={() => navigate("/logout")}>Sign Out</li>
        </ul>
      </div>
      <div className={styles.mainContent}>
        <h2 className={styles.header}>Edit Profile</h2>
        <div className={styles.contentWrapper}>
          <div className={styles.profilePictureSection}>
            <div className={styles.imageUpload}>
              <img
                src={
                  profile.profile_picture
                    ? URL.createObjectURL(profile.profile_picture)
                    : "https://via.placeholder.com/300?text=Profile+Placeholder"
                }
                alt="Profile"
                className={styles.profileImage}
              />
              <div className={styles.imageEdit}>
                <input
                  type="file"
                  name="profile_picture"
                  id="fileInput"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                />
                <label htmlFor="fileInput">Add Profile Picture</label>
              </div>
            </div>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.userInfoSection}>
              <div className={styles.userInfo}>
                <label className={styles.label}>First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={profile.firstname}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.userInfo}>
                <label className={styles.label}>Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={profile.lastname}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.userInfo}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.userInfo}>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.userInfo}>
                <label className={styles.label}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.genderSection}>
                <label className={styles.label}>Gender</label>
                <div className={styles.genderOptions}>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={profile.gender === "male"}
                      onChange={handleInputChange}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={profile.gender === "female"}
                      onChange={handleInputChange}
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.buttons}>
              <button type="submit" className={styles.saveButton}>
                Save
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => navigate("/home")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        <div className={styles.skip}>
          <button
            type="button"
            className={styles.skipButton}
            onClick={() => navigate("/")}
          >
            Skip, Set Up Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
