function Options({ options, dispatch, correctOption, answer }) {
  function handleGuess(index) {
    dispatch({ type: "guess", payload: index });
  }
  return (
    <div className="options">
      {options.map((option, index) => (
        <button
          onClick={() => handleGuess(index)}
          disabled={answer !== null}
          className={`btn btn-option ${
            answer !== null
              ? correctOption === index
                ? "correct"
                : "wrong"
              : ""
          } ${index === answer ? "answer" : ""}`}
          key={option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
