import { useState, useEffect } from "react";
import { FaCircleArrowRight } from "react-icons/fa6";
import styles from "./Question.module.css";
import axios from "../../utils/axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const Question = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { question_id } = useParams();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state) {
      setTitle(location.state.title);
      setDescription(location.state.content);
    } else if (question_id) {
      // Fetch question data if it is not passed via state (e.g., direct URL access)
      const fetchQuestion = async () => {
        try {
          const response = await axios.get(`/question/${question_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTitle(response.data.title);
          setDescription(response.data.description);
        } catch (error) {
          console.log("Error fetching question data:", error);
        }
      };
      fetchQuestion();
    }
  }, [location.state, question_id, token]);

  const handleDescriptionChange = (event) => {
    const textarea = event.target;
    setDescription(textarea.value);
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setError("Please provide all the fields");
      return;
    }

    try {
      if (question_id) {
        // Update existing question
        await axios.put(`/question/${question_id}`, {
          title,
          description,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess("Question updated successfully");
      } else {
        // Create new question
        await axios.post("/question", {
          title,
          description,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess("Question posted successfully");
      }
      navigate("/");
    } catch (error) {
      console.log("Something went wrong");
      console.log(error.response);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <section>
      <div className={styles.upperContainer}>
        {/* title */}
        <div>
          <h3 className={styles.title}>Steps To Write A Good Question</h3>
        </div>
        {/* criteria */}
        <div>
          <ul className={styles.customArrowList}>
            <li>
              <FaCircleArrowRight size={14} className={styles.arrowIcon} />{" "}
              Summarize your problem in a one-line-title
            </li>
            <li>
              <FaCircleArrowRight size={14} className={styles.arrowIcon} />{" "}
              Describe your problem in more detail
            </li>
            <li>
              <FaCircleArrowRight size={14} className={styles.arrowIcon} />{" "}
              Describe what you tried and what you expected to happen
            </li>
            <li>
              <FaCircleArrowRight size={14} className={styles.arrowIcon} />{" "}
              Review your question and post it here
            </li>
          </ul>
        </div>
      </div>

      <h3 className={styles.questionTitle}>{question_id ? "Edit Your Question" : "Post Your Question"}</h3>
      <form onSubmit={handleSave}>
        <div className={styles.questionTitleInput}>
          <input
            type="text"
            placeholder="Question title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.questionDescription}>
          <textarea
            placeholder="Question detail ..."
            rows="3"
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
        </div>
        {success ? <div>{success} </div> : ""}
        {error ? <div>{error}</div> : ""}
        <button type="submit" className={styles.button}>
          {question_id ? "Save" : "Post Question"}
        </button>
        {question_id && (
          <button type="button" className={styles.button} onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>
    </section>
  );
};

export default Question;
