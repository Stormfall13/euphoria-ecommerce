import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  addQnAItem,
  deleteQnAItem,
  clearError,
  setAnswerText,
  setOpenAnswerFor,
  setQuestionText,
} from "../../store/slices/qnaSlice";

const QnAProductPage = () => {
  const dispatch = useDispatch()
  const { id } = useParams();
  
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const { 
    items: qna, 
    loading, 
    error: qnaError, 
    success: qnaSuccess,
    questionText,
    answerTexts = {},
    openAnswerFor 
  } = useSelector((state) => state.qna);

  const handleDeleteQnA = async (itemId) => {
    if (!token) return;
    if (!window.confirm("Удалить?")) return;
    dispatch(deleteQnAItem(itemId));
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    if (!questionText.trim()) {
      dispatch(clearError("Введите вопрос"));
      return;
    }
    if (!token) {
      dispatch(clearError("Необходимо войти в систему"));
      return;
    }

    dispatch(addQnAItem({ 
      productId: id, 
      text: questionText 
    }));
  };

  const handleSubmitAnswer = async (questionId) => {
    const text = answerTexts[questionId] || "";
    dispatch(clearError());
    
    if (!text.trim()) {
      dispatch(clearError("Введите ответ"));
      return;
    }

    dispatch(addQnAItem({ 
      productId: id, 
      text: text,
      parentId: questionId 
    })).then(() => {
      dispatch(setAnswerText({ questionId, text: "" }));
      dispatch(setOpenAnswerFor(null));
    });
  };

  return (
    <div className="qna__module">
      {qnaError && <p style={{ color: "red" }}>{qnaError}</p>}
      {qnaSuccess && <p style={{ color: "green" }}>{qnaSuccess}</p>}

      {/* Форма задания вопроса */}
      <div style={{ marginBottom: "30px" }}>
        <h4>Ask a question</h4>
        {token ? (
          <form onSubmit={handleAskQuestion}>
            <textarea
              placeholder="Ваш вопрос о товаре..."
              value={questionText}
              onChange={(e) => dispatch(setQuestionText(e.target.value))}
              rows={3}
              style={{ width: "100%", maxWidth: "500px", padding: "8px" }}
            />
            <br />
            <button type="submit" disabled={loading} style={{ marginTop: "10px" }}>
              {loading ? "Dispatch..." : "Ask"}
            </button>
          </form>
        ) : (
          <p>Чтобы задать вопрос, пожалуйста, <Link to="/login">войдите</Link> в систему.</p>
        )}
      </div>

      {/* Список вопросов */}
      {loading ? (
        <p>Загрузка вопросов...</p>
      ) : qna.length === 0 ? (
        <p>Пока нет вопросов. Будьте первым!</p>
      ) : (
        qna.map((question) => (
          <div key={question.id} style={{ 
            border: "1px solid #eee", 
            padding: "15px", 
            marginBottom: "20px", 
            borderRadius: "5px" 
          }}>
            {/* Вопрос */}
            <div>
              <strong>Вопрос:</strong>
              <p>{question.text}</p>
              <small style={{ color: "gray" }}>
                от {user.username} / роль: {user.role}, {new Date(question.createdAt).toLocaleDateString()}
              </small>
              {user?.role === "admin" && (
                <button 
                  onClick={() => handleDeleteQnA(question.id)} 
                  style={{ marginLeft: "10px", color: "red", cursor: "pointer" }}
                >
                  ✖
                </button>
              )}
            </div>

            {/* Ответы на вопрос */}
            {question.answers && question.answers.length > 0 && (
              <div style={{ marginLeft: "20px", marginTop: "15px" }}>
                <strong>Ответы:</strong>
                {question.answers.map((answer) => (
                  <div key={answer.id} style={{ 
                    borderLeft: "3px solid #ccc", 
                    paddingLeft: "10px", 
                    marginTop: "10px" 
                  }}>
                    <p>{answer.text}</p>
                    <small style={{ color: "gray" }}>
                      от {answer.User?.username} / роль: {answer.User?.role}, {new Date(answer.createdAt).toLocaleDateString()}
                    </small>
                    {user?.role === "admin" && (
                      <button 
                        onClick={() => handleDeleteQnA(answer.id)} 
                        style={{ marginLeft: "10px", color: "red", cursor: "pointer" }}
                      >
                        ✖
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Форма ответа */}
            {token ? (
              <>
                <button
                  style={{ marginTop: "10px" }}
                  onClick={() => dispatch(setOpenAnswerFor(openAnswerFor === question.id ? null : question.id))}
                >
                  {openAnswerFor === question.id ? "Отменить" : "Ответить"}
                </button>

                {openAnswerFor === question.id && (
                  <div style={{ marginTop: "10px" }}>
                    <textarea
                      placeholder="Ваш ответ..."
                      value={answerTexts[question.id] || ""}
                      onChange={(e) => dispatch(setAnswerText({ 
                        questionId: question.id, 
                        text: e.target.value 
                      }))}
                      rows={2}
                      style={{ width: "100%", maxWidth: "400px", padding: "8px" }}
                    />
                    <br />
                    <button
                      onClick={() => handleSubmitAnswer(question.id)}
                      style={{ marginTop: "5px" }}
                    >
                      Отправить ответ
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p style={{ marginTop: "10px", fontSize: "0.9em" }}>
                <Link to="/login">Войдите</Link>, чтобы ответить.
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default QnAProductPage
