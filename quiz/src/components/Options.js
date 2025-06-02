import { useQuiz } from "../context/QuizContext";

function Options({ options, correctOption }) {
  const { dispatch, answer } = useQuiz();
  function handleGuess(index) {
    dispatch({ type: "guess", payload: index });
  }
  return (
    <div className="options">
      {options.map((option, i) => (
        <button
          onClick={() => handleGuess(i)}
          disabled={answer !== null}
          className={`btn btn-option ${
            answer !== null ? (correctOption === i ? "correct" : "wrong") : ""
          } ${i === answer ? "answer" : ""}`}
          key={option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
