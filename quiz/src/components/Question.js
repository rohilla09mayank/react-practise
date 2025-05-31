import Options from "./Options";

function Question({ question, dispatch, answer }) {
  console.log(question);
  return (
    <div className="question">
      <h4>{question.question}</h4>
      <Options
        options={question.options}
        correctOption={question.correctOption}
        dispatch={dispatch}
        answer={answer}
      />
    </div>
  );
}

export default Question;
