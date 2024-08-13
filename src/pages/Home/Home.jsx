import {
    useEffect,
    useReducer,
    useCallback,
    useMemo,
    useContext,
  } from "react";
  import { useNavigate, Link } from "react-router-dom";
  import { toast, ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import axios from "../../utils/axios";
  import { AppState } from "../../App";
  import styles from "./Home.module.css";
  import avatarImg from "../../assets/avatar.jpg";

  import {
    FileQuestion,
    Search,
    EllipsisVertical,
    PartyPopper,
    X,
    SkipBack,
    SkipForward,
  } from "lucide-react";
  import { Comment } from "react-loader-spinner";
  
  // Action types
  const ACTIONS = {
    SET_IS_LOADING: "SET_IS_LOADING",
    SET_USERNAME: "SET_USERNAME",
    SET_SEARCH_VALUE: "SET_SEARCH_VALUE",
    RESET_SEARCH_VALUE: "RESET_SEARCH_VALUE",
    SET_QUESTIONS: "SET_QUESTIONS",
    SET_FILTERED_QUESTIONS: "SET_FILTERED_QUESTIONS",
    TOGGLE_MENU: "TOGGLE_MENU",
    SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
    SET_ERROR: "SET_ERROR",
  };
  
  // Initial state for the reducer
  const initialState = {
    isLoading: false,
    username: "",
    searchValue: "",
    questions: [],
    filteredQuestions: [],
    openMenuId: null,
    currentPage: 1,
    questionsPerPage: 5,
    error: null,
  };
  
  // Reducer function to handle state updates
  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.SET_IS_LOADING:
        return { ...state, isLoading: action.payload };
      case ACTIONS.SET_USERNAME:
        return { ...state, username: action.payload };
      case ACTIONS.SET_SEARCH_VALUE:
        return { ...state, searchValue: action.payload, currentPage: 1 };
      case ACTIONS.RESET_SEARCH_VALUE:
        return {
          ...state,
          searchValue: "",
          filteredQuestions: state.questions,
          currentPage: 1,
        };
      case ACTIONS.SET_QUESTIONS:
        return {
          ...state,
          questions: action.payload,
          filteredQuestions: action.payload,
        };
      case ACTIONS.SET_FILTERED_QUESTIONS:
        return { ...state, filteredQuestions: action.payload };
      case ACTIONS.TOGGLE_MENU:
        return { ...state, openMenuId: action.payload };
      case ACTIONS.SET_CURRENT_PAGE:
        return { ...state, currentPage: action.payload };
      case ACTIONS.SET_ERROR:
        return { ...state, error: action.payload };
      default:
        return state;
    }
  };
  
  const Home = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { user } = useContext(AppState);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
  
    const fetchData = async () => {
      dispatch({ type: ACTIONS.SET_IS_LOADING, payload: true });
      dispatch({ type: ACTIONS.SET_ERROR, payload: null });
      try {
        const questionsResponse = await axios.get(`/question/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(questionsResponse)
        const sortedQuestions = questionsResponse.data.questions.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        dispatch({
          type: ACTIONS.SET_QUESTIONS,
          payload: sortedQuestions,
        });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: ACTIONS.SET_IS_LOADING, payload: false });
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [token]);
  
    const handleInputChange = (e) => {
      const searchValue = e.target.value;
      dispatch({ type: ACTIONS.SET_SEARCH_VALUE, payload: searchValue });
  
      const filtered = state.questions.filter(
        (question) =>
          question?.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          question?.user_name.toLowerCase().includes(searchValue.toLowerCase())
      );
      dispatch({
        type: ACTIONS.SET_FILTERED_QUESTIONS,
        payload: filtered,
      });
    };
  
    const handleResetSearchValue = () => {
      dispatch({ type: ACTIONS.RESET_SEARCH_VALUE });
    };
  
    const handleToggleMenu = useCallback(
      (questionId) => {
        dispatch({
          type: ACTIONS.TOGGLE_MENU,
          payload: state.openMenuId === questionId ? null : questionId,
        });
      },
      [state.openMenuId]
    );
  
    const handleOutsideClick = useCallback(() => {
      if (state.openMenuId !== null) {
        dispatch({ type: ACTIONS.TOGGLE_MENU, payload: null });
      }
    }, [state.openMenuId]);
  
    const handlePageChange = (newPage) => {
      dispatch({ type: ACTIONS.SET_CURRENT_PAGE, payload: newPage });
    };
  
    const handleEdit = (question) => {
      navigate(`/question/${question.question_id}/edit`, {
        state: { title: question.title, content: question.content },
      });
    };
  
    const handleDelete = async (questionId) => {
      try {
        await axios.delete(`/question/${questionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch({
          type: ACTIONS.SET_QUESTIONS,
          payload: state.questions.filter(
            (question) => question.question_id !== questionId
          ),
        });
        toast.success("Question deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete question: " + err.message);
      }
    };
  
    const handleShare = (questionId) => {
      const url = `${window.location.origin}/question/${questionId}`;
      navigator.clipboard
        .writeText(url)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch((err) => toast.error("Failed to copy link: " + err));
    };
  
    const handleAddonsClick = (e, questionId) => {
      e.stopPropagation();
      handleShare(questionId);
    };
  
    const totalPages = useMemo(
      () => Math.ceil(state.filteredQuestions.length / state.questionsPerPage),
      [state.filteredQuestions, state.questionsPerPage]
    );
  
    const indexOfLastQuestion = state.currentPage * state.questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - state.questionsPerPage;
    const currentQuestions = state.filteredQuestions.slice(
      indexOfFirstQuestion,
      indexOfLastQuestion
    );
  
    if (state.isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <Comment
            visible={true}
            height="80"
            width="80"
            ariaLabel="comment-loading"
            color="#F4442E"
            backgroundColor="#ddd"
          />
        </div>
      );
    }
  
    if (state.error) {
      return (
        <div className={styles.errorContainer}>
          <p>An error occurred: {state.error}</p>
        </div>
      );
    }
    return (
      <section className={styles.homeContainer} onClick={handleOutsideClick}>
        <header className={styles.headerContainer}>
          <button
            type="button"
            className={styles.askQuestionButton}
            onClick={() => navigate("/question")}
          >
            <span>
              <FileQuestion className={styles.questionIcon} />
              <p>Ask Question</p>
            </span>
          </button>
  
          <div className={styles.welcomeMessage}>
            <PartyPopper className={styles.partyPopperIcon} />
            <Link to={`/user/${user?.username}`}>
              <p>Welcome: {user?.username}</p>
            </Link>
          </div>
        </header>
  
        <div className={styles.searchBarContainer}>
          <span>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search for questions"
              className={styles.searchBar}
              value={state.searchValue}
              onChange={handleInputChange}
            />
            {state.searchValue && (
              <X className={styles.remove} onClick={handleResetSearchValue} />
            )}
          </span>
        </div>
  
        <div className={styles.questionListContainer}>
          {state.filteredQuestions.length === 0 ? (
            <div className={styles.noResultsMessage}>
              <p>No questions found matching your search.</p>
            </div>
          ) : (
            currentQuestions.map((question) => (
              <div key={question.question_id} className={styles.questionContainer}>
                <div className={styles.questionContainerWrapper}>
                  <div className={styles.userInfoContainer}>
                    <Link to={`/user/${question.user_name}`}>
                      <img
                        src={avatarImg}
                        alt="User Avatar"
                        className={styles.userAvatar}
                      />
                      <span className={styles.username}>{question.user_name}</span>
                    </Link>
                  </div>
  
                  <div
                    className={styles.container}
                    onClick={() => navigate(`/question/${question.question_id}`)}
                  >
                    <div className={styles.titleContainer}>
                      <p className={styles.title}>{question.title}</p>
                    </div>
                    <div className={styles.answerCountContainer}>
                      <img
                          src="https://cdn-icons-png.flaticon.com/128/9592/9592933.png"
                        alt=""
                        className={styles.messageIcon}
                        />
                      <span className={styles.answerCount}>
                        {question.answer_count}{" "}
                        {question.answer_count === 1 ||
                        question.answer_count === 0
                          ? "answer"
                          : "answers"}
                      </span>
                    </div>
                  </div>
  
                  <div>
                    <EllipsisVertical
                      className={styles.menuIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMenu(question.question_id);
                      }}
                    />
  
                    {state.openMenuId === question.question_id && (
                      <div className={styles.addonsContainer}>
                        {user?.username === question.user_name ? (
                          <>
                            <button onClick={() => handleEdit(question)}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(question.question_id)}>
                              Delete
                            </button>
                          </>
                        ) : null}
  
                        <button
                          type="button"
                          onClick={(e) =>
                            handleAddonsClick(e, question.question_id)
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
            ))
          )}
        </div>
  
        <div className={styles.paginationContainer}>
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(state.currentPage - 1)}
            disabled={state.currentPage === 1}
          >
            <SkipBack />
          </button>
  
          <span>
            Page {state.currentPage} of {totalPages}
          </span>
  
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(state.currentPage + 1)}
            disabled={state.currentPage === totalPages}
          >
            <SkipForward />
          </button>
        </div>
      </section>
    );
  };
  
  export default Home;
  