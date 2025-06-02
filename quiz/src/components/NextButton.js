import { useQuiz } from "../context/QuizContext";

function NextButton() {
  const { answer, dispatch } = useQuiz();

  if (answer === null) return;
  return (
    <button
      className="btn btn-ui"
      onClick={() => dispatch({ type: "nextQuestion" })}
    >
      Next
    </button>
  );
}

export default NextButton;
