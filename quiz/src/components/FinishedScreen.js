import { useQuiz } from "../context/QuizContext";

function FinishedScreen() {
  const { points, totalPoints } = useQuiz();
  return (
    <p className="result">
      Your Score is{" "}
      <strong>
        {points}/{totalPoints}
      </strong>
    </p>
  );
}

export default FinishedScreen;
