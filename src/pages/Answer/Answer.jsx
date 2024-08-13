import { useState, useEffect, useRef, useContext } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "../../utils/axios";
import styles from "../../pages/Answer/Answer.module.css";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { SkipBack, SkipForward, EllipsisVertical } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppState } from "../../App";

const AnsandQues = () => {
  const navigate = useNavigate();
  const { question_id, answer_id } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [singlequestion, setsinglequestion] = useState(null);
  const [answers, setanswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [answersPerPage] = useState(5);
  const { user } = useContext(AppState);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAnswerId, setEditAnswerId] = useState(null);

  const answerRef = useRef();

  const toggleMenu = (answerId) => {
    setOpenMenuId(openMenuId === answerId ? null : answerId);
  };

  async function singleQuestion() {
    try {
      const { data } = await axios.get(`/question/${question_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setsinglequestion(data.question);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function getAnswer() {
    try {
      const { data } = await axios.get(`/answer/${question_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setanswers(data?.answers);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  useEffect(() => {
    singleQuestion();
    getAnswer();
  }, [question_id]);

  useEffect(() => {
    if (location.state?.content) {
      answerRef.current.value = location.state.content;
      setIsEditMode(true);
      setEditAnswerId(answer_id);
    }
  }, [location.state, answer_id]);

  async function handleLike(answerId) {
    try {
      const { data } = await axios.post(
        `/answer/${answerId}/like`,
        { answerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setanswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.answer_id === answerId
            ? {
                ...answer,
                num_like: data.num_likes,
                num_dislike: data.num_dislikes,
              }
            : answer
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDislike(answerId) {
    try {
      const { data } = await axios.post(
        `/answer/${answerId}/dislike`,
        { answerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setanswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.answer_id === answerId
            ? {
                ...answer,
                num_like: data.num_likes,
                num_dislike: data.num_dislikes,
              }
            : answer
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const answer = answerRef.current.value;

    if (isEditMode) {
      try {
        await axios.put(
          `/answer/${editAnswerId}`,
          { answer },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSuccess("Answer updated successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 5000);

        setanswers((prevAnswers) =>
          prevAnswers.map((ans) =>
            ans.answer_id === editAnswerId ? { ...ans, content: answer } : ans
          )
        );

        answerRef.current.value = "";
        setIsEditMode(false);
        setEditAnswerId(null);
      } catch (error) {
        console.error("Error updating answer", error);
      }
    } else {
      try {
        await axios.post(
          "/answer/",
          {
            questionid: question_id,
            answer: answer,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSuccess("Answer posted successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 5000);

        answerRef.current.value = "";
        getAnswer();
      } catch (error) {
        console.error("Error submitting answer", error);
      }
    }
  };

  const handleEdit = (answer) => {
    answerRef.current.value = answer.content;
    setIsEditMode(true);
    setEditAnswerId(answer.answer_id);
  };

  const handleDelete = async (answerId) => {
    try {
      await axios.delete(`/answer/${answerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Answer deleted successfully!");
      setanswers((prevAnswers) =>
        prevAnswers.filter((answer) => answer.answer_id !== answerId)
      );
    } catch (error) {
      toast.error("Failed to delete answer: " + error.message);
    }
  };

  const handleCancel = () => {
    answerRef.current.value = "";
    setIsEditMode(false);
    setEditAnswerId(null);
  };

  const handleShare = (answerId) => {
    const url = `${window.location.origin}/answer/${answerId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch((err) => toast.error("Failed to copy link: " + err));
  };

  const handleAddonsClick = (e, answerId) => {
    e.stopPropagation();
    handleShare(answerId);
  };

  const handleOutsideClick = () => {
    if (openMenuId !== null) {
      setOpenMenuId(null);
    }
  };

  // Sort answers by number of likes in descending order
  const sortedAnswers = answers.sort((a, b) => b.num_like - a.num_like);

  // Pagination
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = sortedAnswers.slice(
    indexOfFirstAnswer,
    indexOfLastAnswer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(answers.length / answersPerPage);

  return (
    <div onClick={handleOutsideClick}>
      <div className={styles.questionContainer}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div>
            <div className={styles.question}>
              <div className={styles.questionTitle}>
                {singlequestion?.title}
              </div>
              <div className={styles.questionContent}>
                {singlequestion?.content}
              </div>
            </div>
            <h1 className={styles.sectionSubHeader}>
              Answers from the community
            </h1>
            <div className={styles.separator} />
            <div className={styles.answerContainer}>
              {currentAnswers.length === 0 ? (
                <div className={styles.noAnswers}>Be the first to answer!</div>
              ) : (
                currentAnswers.map((answer, i) => (
                  <div key={i}>
                    <div className={styles.answer_card}>
                      <div className={styles.answer_user_info}>
                        <Link to={`/user/${answer.user_name}`}>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/892/892781.png"
                            alt="Avatar"
                            className={styles.avatar}
                          />
                          <div className={styles.username}>
                            {answer.user_name}
                          </div>
                        </Link>
                      </div>
                      <div
                        className={styles.answer_content_div}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className={styles.answer_content}>
                          {answer.content}
                        </div>
                        <div className={styles.answer_actions}>
                          <div className={styles.likes}>
                            <i onClick={() => handleLike(answer.answer_id)}>
                              <BiSolidLike
                                size={22}
                                className={styles.likeButton}
                              />
                            </i>
                            {answer.num_like}
                          </div>
                          <div className={styles.dislikes}>
                            <i onClick={() => handleDislike(answer.answer_id)}>
                              <BiSolidDislike
                                size={22}
                                className={styles.dislikeButton}
                              />
                            </i>
                            {answer.num_dislike}
                          </div>
                          <EllipsisVertical
                            size={22}
                            className={styles.menuIcon}
                            onClick={() => toggleMenu(answer.answer_id)}
                          />
                          {openMenuId === answer.answer_id && (
                            <div className={styles.addonsContainer}>
                              {user?.username === answer.user_name ? (
                                <>
                                  <button onClick={() => handleEdit(answer)}>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(answer.answer_id)}
                                  >
                                    Delete
                                  </button>
                                </>
                              ) : null}
                              <button
                                type="button"
                                onClick={(e) =>
                                  handleAddonsClick(e, answer.answer_id)
                                }
                              >
                                Share
                              </button>
                              <ToastContainer
                                position="top-right"
                                autoClose={1000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="light"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={styles.separator} />
                  </div>
                ))
              )}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.paginationContainer} id="post">
                <button
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                  className={styles.paginationButton}
                >
                  <span>
                    <SkipBack />
                    Prev
                  </span>
                </button>
                <span className={styles.pageInfo}>
                  {currentPage}/{Math.ceil(answers.length / answersPerPage)}
                </span>
                <button
                  disabled={
                    currentPage === Math.ceil(answers.length / answersPerPage)
                  }
                  onClick={() => paginate(currentPage + 1)}
                  className={styles.paginationButton}
                >
                  <span>
                    Next
                    <SkipForward />
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className={styles.postAnswer} id="post">
          <div className={styles.postHeader}>
            <h3 className={styles.sectionSubHeader}>
              {isEditMode ? "Edit your answer" : "Post your answer"}
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              ref={answerRef}
              className={styles.answerTextarea}
              placeholder="Enter your answer here..."
              required
            />
            {success && (
              <div>
                <span>{success}</span>
                <Link to={"/"} className={styles.backtohome}>
                  wanna go back to home
                </Link>
              </div>
            )}
            <div className={styles.postAnswerActions}>
              <button type="submit" className={styles.postAnswerButton}>
                {isEditMode ? "Save" : "Post Answer"}
              </button>
              {isEditMode && (
                <button
                  type="button"
                  className={styles.postAnswerButton}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnsandQues;
