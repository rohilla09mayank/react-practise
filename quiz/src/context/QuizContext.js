import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const initialState = {
  questions: [],
  // loading, error(on error), ready(once data is recieved), active, finished
  index: 0,
  status: "loading",
  points: 0,
  answer: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "startQuiz":
      return { ...state, status: "active" };
    case "guess":
      return {
        ...state,
        points:
          state.questions[state.index].correctOption === action.payload
            ? state.points + state.questions[state.index].points
            : state.points,
        answer: action.payload,
      };
    case "nextQuestion":
      if (state.index + 1 === state.questions.length) {
        return {
          ...state,
          status: "finished",
        };
      }

      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    default:
      throw new Error("Unknown action");
  }
}

export function QuizProvider({ children }) {
  const [{ points, answer, questions, status, index }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchQuestions() {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed", payload: err.message });
      }
    }
    fetchQuestions();
  }, []);

  const totalPoints = questions.reduce((sum, item) => sum + item.points, 0);
  const numQuestions = questions.length;

  return (
    <QuizContext.Provider
      value={{
        points,
        answer,
        questions,
        status,
        index,
        totalPoints,
        numQuestions,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) throw new Error("Context used outside provider");
  return context;
}
