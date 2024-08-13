import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Link, useParams } from "react-router-dom";
import styles from "./User.module.css";

import { ChevronRight } from "lucide-react";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi";

const User = () => {
  const { username } = useParams();
  const token = localStorage.getItem("token");
  const [questions, setQuestions] = useState([]);
  // const { user } = useContext(AppState);
  const [answers, setAnswers] = useState([]);
  const [showMoreAnswers, setShowMoreAnswers] = useState(false);
  const [showMoreLimit, setShowMoreLimit] = useState(5);
  const [showMoreQuestions, setShowMoreQuestions] = useState(false);
  const [showMoreQuestionsLimit, setShowMoreQuestionsLimit] = useState(5);
  const [backToFiveQ, setBackToFiveQ] = useState(true);
  const [backToFiveA, setBackToFiveA] = useState(true);

  async function allQuestion() {
    try {
      const { data } = await axios.get("/question/all", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const sortedQuestions = data.questions.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      const filteredQuestions = sortedQuestions.filter(
        (question) => question.user_name === username
      );
      setQuestions(filteredQuestions);
    } catch (error) {
      if (error.response) {
        console.error("Error fetching questions:", error.response.data);
      } else if (error.request) {
        console.error("Error making request:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  }

  async function getUserAnswers() {
    try {
      const { data } = await axios.get(`/answer/user/${username}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      // Fetch the question details for each answer
      const answersWithQuestions = await Promise.all(
        data.answers.map(async (answer) => {
          const { data: questionData } = await axios.get(
            `/question/${answer.question_id}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          return { ...answer, question: questionData.question };
        })
      );

      setAnswers(answersWithQuestions);
    } catch (error) {
      if (error.response) {
        console.error("Error fetching answers:", error.response.data);
      } else if (error.request) {
        console.error("Error making request:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  }

  useEffect(() => {
    allQuestion();
    getUserAnswers();
  }, [username]);

  const handleShowMoreAnswers = () => {
    setShowMoreAnswers(true);
    setBackToFiveA(true);
    setShowMoreLimit(showMoreLimit + 5);
  };

  const handleShowLessAnswers = () => {
    setShowMoreLimit(showMoreLimit - 5);
  };

  const handleShow5Answers = () => {
    setShowMoreLimit(5);
  };

  const handlebackToFiveA = () => {
    setBackToFiveA(false);
    setShowMoreLimit(5);
  };

  const handleShowMoreQuestions = () => {
    setShowMoreQuestions(true);
    setBackToFiveQ(true);
    setShowMoreQuestionsLimit(showMoreQuestionsLimit + 5);
  };

  const handleShowLessQuestions = () => {
    setShowMoreQuestionsLimit(showMoreQuestionsLimit - 5);
  };

  const handleShow5Questions = () => {
    setShowMoreQuestionsLimit(5);
  };
  const handlebackToFiveQ = () => {
    setBackToFiveQ(false);
    setShowMoreQuestionsLimit(5);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.answer_user_info}>
          <Link to={`/userprofile/${username}`}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/892/892781.png"
              alt="Avatar"
              className={styles.avatar}
            />
            <div className={styles.username}>{username}</div>
          </Link>
        </div>
        <div>
          <h1>Questions Posted</h1>
          {questions?.length === 0 ? (
            <div>No questions found for this user.</div>
          ) : (
            <>
              {questions?.slice(0, showMoreQuestionsLimit).map((question) => (
                <div key={question.question_id}>
                  <div className={styles.question_card}>
                    <Link
                      to={`/question/${question.question_id}`}
                      className={styles.question_title_div}
                    >
                      <div className={styles.question_title}>
                        <div>{question.title}</div>
                        <div className={styles.answers}>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/9592/9592933.png"
                            alt=""
                          />
                          <i className="fas fa-comment"></i>
                          {question.answer_count}
                        </div>
                      </div>
                      <div className={styles.chevron_icon}>
                        <ChevronRight />
                      </div>
                    </Link>
                  </div>
                  <div className={styles.separator} />
                </div>
              ))}
              {questions.length > showMoreQuestionsLimit && (
                <div className={styles.show_more_button}>
                  {showMoreQuestions ? (
                    showMoreQuestionsLimit <= 5 ? (
                      <button onClick={handleShowMoreQuestions}>
                        Show More
                      </button>
                    ) : questions.length > showMoreQuestionsLimit + 5 ? (
                      <>
                        <button onClick={handleShowMoreQuestions}>
                          Show More
                        </button>
                        <button onClick={handleShowLessQuestions}>
                          Show Less
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={handleShow5Questions}>
                          Show Less
                        </button>
                      </>
                    )
                  ) : (
                    <button onClick={handleShowMoreQuestions}>Show More</button>
                  )}
                </div>
              )}
              {(questions.length < 11) & showMoreQuestions & backToFiveQ ? (
                <div className={styles.showlessbtn}>
                  <button onClick={handlebackToFiveQ}>Show Less</button>
                </div>
              ) : null}
            </>
          )}
        </div>
        <div>
          <h1>Answers Posted</h1>
          {answers?.length === 0 ? (
            <div>No answers found for this user.</div>
          ) : (
            <>
              {answers
                ?.sort((a, b) => b.num_like - a.num_like)
                .slice(0, showMoreLimit)
                .map((answer) => (
                  <div key={answer.answer_id} className={styles.answer_card}>
                    <div className={styles.question_title_container}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/7887/7887104.png"
                        alt=""
                      />
                      <div className={styles.question_title}>
                        <Link to={`/question/${answer.question_id}`}>
                          {answer.question.title}
                        </Link>
                      </div>
                    </div>
                    <div className={styles.answer_content_container}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/807/807281.png"
                        alt=""
                      />
                      <div>
                        <div className={styles.answer_content}>
                          {answer.content}
                        </div>
                        <div className={styles.answer_footer}>
                          <div className={styles.like_dislike}>
                            <div className={styles.likes}>
                              <i onClick={() => handleLike(answer.answer_id)}>
                                <BiSolidLike
                                  size={18}
                                  className={styles.likeButton}
                                />
                              </i>
                              {answer.num_like}
                            </div>
                            <div className={styles.dislikes}>
                              <i
                                onClick={() => handleDislike(answer.answer_id)}
                              >
                                <BiSolidDislike
                                  size={18}
                                  className={styles.dislikeButton}
                                />
                              </i>
                              {answer.num_dislike}
                            </div>
                            <div className={styles.created_at}>
                              {new Date(answer.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {answers.length > showMoreLimit && (
                <div className={styles.show_more_button}>
                  {showMoreAnswers ? (
                    showMoreLimit <= 5 ? (
                      <button onClick={handleShowMoreAnswers}>Show More</button>
                    ) : answers.length > showMoreLimit + 5 ? (
                      <>
                        <button onClick={handleShowMoreAnswers}>
                          Show More
                        </button>
                        <button onClick={handleShowLessAnswers}>Show Less</button>
                      </>
                    ) : (
                      <>
                        <button onClick={handleShow5Answers}>Show Less</button>
                      </>
                    )
                  ) : (
                    <button onClick={handleShowMoreAnswers}>Show More</button>
                  )}
                </div>
              )}
              {(answers.length < 11) & showMoreAnswers & backToFiveA ? (
                <div className={styles.showlessbtn}>
                  <button
                    onClick={handlebackToFiveA}
                    className={styles.showlessbtn}
                  >
                    Show Less
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
