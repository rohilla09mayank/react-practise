import { useQuiz } from "../context/QuizContext";

function Progress() {
  const { points, index, totalPoints, numQuestions } = useQuiz();

  return (
    <header className="progress">
      <progress max={numQuestions} value={index} />
      <p>
        Question <strong>{index + 1}</strong>/{numQuestions}
      </p>
      <p>
        <strong>{points}</strong>/{totalPoints} points
      </p>
    </header>
  );
}

export default Progress;
