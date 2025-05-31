function FinishedScreen({ points, totalPoints }) {
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
