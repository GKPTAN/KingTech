import { useState } from "react";
import { MdCreate } from "react-icons/md";
import { BiSolidLike, BiSolidDislike, BiLike, BiDislike } from "react-icons/bi";
import Search from "../../../../Search";
import Button from "../../../Button";

const Answer = ({ answer }) => {
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);

  const toggleLike = () => {
    if (like) {
      setLike(false);
    } else {
      setLike(true);
      setDislike(false);
    }
  };

  const toggleDislike = () => {
    if (dislike) {
      setDislike(false);
    } else {
      setDislike(true);
      setLike(false);
    }
  };

  return (
    <div className="answer">
      <p className="answer-text">{answer.text}</p>
      <span className="answer-meta">
        {answer.author} - {answer.date}
      </span>
      <div className="feedback">
        <span>Esta resposta foi útil?</span>
        <Button
          type="button"
          nameAction=""
          className="btn-like"
          disabled={false}
          onClick={toggleLike}
          icon={
            like ? <BiSolidLike size={20} fill="#000" /> : <BiLike size={20} />
          }
        />
        <span>{answer.likesCount + (like ? 1 : 0)}</span>

        <Button
          type="button"
          nameAction=""
          className="btn-dislike"
          disabled={false}
          onClick={toggleDislike}
          icon={
            dislike ? <BiSolidDislike size={20} fill="#000" /> : <BiDislike size={20}/>
          }
        />
        <span>{answer.dislikesCount + (dislike ? 1 : 0)}</span>
      </div>
    </div>
  );
};

const QuestionsAndAnswers = ({ maxQuestions = 50, questions = [] }) => {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);
  const [newQuestion, setNewQuestion] = useState("");
  const [expanded, setExpanded] = useState({});
  const filteredQuestions = questions.filter((q) =>
    q.text.toLowerCase().includes(query.toLowerCase())
  );

  const handleCreateQuestion = () => {
    if (!newQuestion.trim()) return;
    if (questions.length >= maxQuestions) return alert("Limite atingido");

    questions.push({
      id: Date.now(),
      text: newQuestion,
      answers: [],
    });

    setNewQuestion("");
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="questions-and-answers">
      <div className="qna-header">
        <h3>Perguntas e Respostas</h3>
        <Search onSearchChange={setQuery} />
      </div>

      <p className="count">
        {questions.length}{" "}
        {questions.length === 1
          ? "pergunta feita"
          : questions.length > 1
          ? "perguntas feitas"
          : "sem perguntas"}
      </p>

      <div className="create-question">
        <textarea
          name="question"
          id="question_user"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Escreva sua pergunta..."
          disabled={questions.length >= maxQuestions}
        />
        <Button
          type="button"
          nameAction="Criar Pergunta"
          className=""
          disabled={questions.length >= maxQuestions}
          onClick={handleCreateQuestion}
          icon={<MdCreate size={20} />}
        />
      </div>

      <ul className="questions-list">
        {filteredQuestions.slice(0, visibleCount).map((q) => (
          <li key={q.id} className="question-item">
            <p className="question">{q.text}</p>
            <span className="answer-count">
              {q.answers.length === 0 ? "" : q.answers.length} {" "}
              {q.answers.length === 1
                ? "resposta"
                : q.answers.length > 1
                ? "respostas"
                : "sem resposta"}
            </span>

            {q.answers.length > 0 && (
              <Answer answer={q.answers[0]}/>
            )}

            {expanded[q.id] &&
              q.answers.slice(1).map((ans) => (
                <Answer key={ans.id} answer={ans}/>
              ))}

            {q.answers.length > 1 && (
              <Button
                type="button"
                nameAction={
                  expanded[q.id]
                    ? "Ocultar respostas"
                    : "Ver todas as respostas"
                }
                className="show-answers"
                onClick={() => toggleExpand(q.id)}
                disabled={false}
                icon={""}
              />
            )}
          </li>
        ))}
      </ul>

      {visibleCount < filteredQuestions.length && (
        <Button
          type="button"
          nameAction="Mostrar mais"
          className="show-more"
          disabled={false}
          onClick={() => setVisibleCount((prev) => prev + 3)}
          icon=""
        />
      )}
    </div>
  );
};

export default QuestionsAndAnswers;
