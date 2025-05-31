import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";

const initialState = {
  questions: [],
  // loading, error(on error), ready(once data is recieved), active, finished
  index: 0,
  status: "loading",
  points: 0,
  answer: null,
};

// dataReceived (api data recieved), dataFailed (api data failed)

// use index -> Make options component -> noew componenets folder ->  handle guess (score update, correct answer , next btn)

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

export default function App() {
  const [{ points, answer, questions, status, index }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const totalPoints = questions.reduce((sum, item) => sum + item.points, 0);
  const numQuestions = questions.length;

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

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestion={numQuestions}
              points={points}
              totalPoints={totalPoints}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
        {status === "finished" && (
          <>
            <FinishedScreen points={points} totalPoints={totalPoints} />
            <button
              className="btn btn-ui"
              onClick={() => dispatch({ type: "restart" })}
            >
              Restart Quiz
            </button>
          </>
        )}
      </Main>
    </div>
  );
}
