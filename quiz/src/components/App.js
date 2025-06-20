import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import { useQuiz } from "../context/QuizContext";

export default function App() {
  const { dispatch, status } = useQuiz();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <NextButton />
          </>
        )}
        {status === "finished" && (
          <>
            <FinishedScreen />
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
