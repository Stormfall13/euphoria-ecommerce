import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CommentModerPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [comments, setComments] = useState([]);
  const [publishedComments, setPublishedComments] = useState([]);
  const [activeTab, setActiveTab] = useState("comments");

  // 🔹 Загрузка комментариев на модерацию
  useEffect(() => {
    if (!token || !user || user.role !== "admin") return;

    fetch(`${process.env.REACT_APP_API_URL}/api/comments/moderation`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error("Ошибка загрузки комментариев", err));

    // 🔹 Загрузка опубликованных комментариев
    fetch(`${process.env.REACT_APP_API_URL}/api/comments/published`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setPublishedComments(data))
      .catch(err => console.error("Ошибка загрузки опубликованных комментариев", err));

  }, [token, user, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!user) return;
    if (user.role !== "admin") {
      navigate("/");
      return;
    } 
  }, [token, user, navigate]);

  // 🔹 Функция для публикации комментария
  const handlePublishComment = async (commentId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/comments/${commentId}/publish`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Комментарий опубликован!");
        // Обновляем списки
        const publishedComment = comments.find(comment => comment.id === commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
        setPublishedComments(prev => [publishedComment, ...prev]);
      } else {
        alert("Ошибка при публикации");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Не удалось опубликовать комментарий");
    }
  };

  // 🔹 Функция для удаления комментария
  const handleDeleteComment = async (commentId, isPublished = false) => {
    if (!window.confirm("Удалить этот комментарий?")) {
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Комментарий удален!");
        // Обновляем соответствующий список
        if (isPublished) {
          setPublishedComments(prev => prev.filter(comment => comment.id !== commentId));
        } else {
          setComments(prev => prev.filter(comment => comment.id !== commentId));
        }
      } else {
        alert("Ошибка при удалении");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Не удалось удалить комментарий");
    }
  };

  return (
    <div className="comment__moders">
    {/* Переключение вкладок */}
    <div style={{ marginTop: "40px", borderBottom: "1px solid #ccc" }}>
      <button 
        onClick={() => setActiveTab("comments")}
        style={{ 
          padding: "10px 20px", 
          marginRight: "10px", 
          backgroundColor: activeTab === "comments" ? "#007bff" : "#f0f0f0",
          color: activeTab === "comments" ? "white" : "black",
          border: "none",
          cursor: "pointer"
        }}
      >
        На модерации ({comments.length})
      </button>
      <button 
        onClick={() => setActiveTab("published")}
        style={{ 
          padding: "10px 20px", 
          backgroundColor: activeTab === "published" ? "#007bff" : "#f0f0f0",
          color: activeTab === "published" ? "white" : "black",
          border: "none",
          cursor: "pointer"
        }}
      >
        Опубликованные ({publishedComments.length})
      </button>
    </div>

    {/* Вкладка комментариев на модерации */}
    {activeTab === "comments" && (
      <div style={{ marginTop: "20px" }}>
        <h2>Комментарии на модерации</h2>
        {comments.length === 0 ? (
          <p>Нет комментариев для модерации. Отличная работа!</p>
        ) : (
          <div className="comments-grid">
            {/* Заголовки */}
            <div className="grid-header" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr 1fr',
              gap: '10px',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
              borderBottom: '2px solid #ddd'
            }}>
              <div>Товар</div>
              <div>Автор</div>
              <div>Email</div>
              <div>Текст</div>
              <div>Дата</div>
              <div>Действия</div>
            </div>

            {/* Комментарии */}
            {comments.map((comment) => (
              <div key={comment.id} className="grid-row" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr 1fr',
                gap: '10px',
                padding: '15px 10px',
                borderBottom: '1px solid #eee',
                alignItems: 'center'
              }}>
                <div>{comment.Product?.nameProd || "Товар удален"}</div>
                <div>{user.username}</div>
                <div>{user.username ? comment.User.email : comment.guestEmail}</div>
                <div style={{ maxWidth: '300px', wordBreak: 'break-word' }}>
                  {comment.text}
                </div>
                <div>{new Date(comment.createdAt).toLocaleDateString()}</div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    onClick={() => handlePublishComment(comment.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}
                  >
                    Опубликовать
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id, false)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ff4444",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {/* Вкладка опубликованных комментариев */}
    {activeTab === "published" && (
      <div style={{ marginTop: "20px" }}>
        <h2>Опубликованные комментарии</h2>
        {publishedComments.length === 0 ? (
          <p>Нет опубликованных комментариев</p>
        ) : (
          <div className="published-comments-grid">
            {/* Заголовки */}
            <div className="grid-header" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr 1fr',
              gap: '10px',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
              borderBottom: '2px solid #ddd'
            }}>
              <div>Товар</div>
              <div>Автор</div>
              <div>Email</div>
              <div>Текст</div>
              <div>Дата публикации</div>
              <div>Действия</div>
            </div>

            {/* Комментарии */}
            {publishedComments.map((comment) => (
              <div key={comment.id} className="grid-row" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr 1fr',
                gap: '10px',
                padding: '15px 10px',
                borderBottom: '1px solid #eee',
                alignItems: 'center'
              }}>
                <div>{comment.Product?.nameProd || "Товар удален"}</div>
                <div>{user.username}</div>
                <div>{comment.User ? comment.User.email : comment.guestEmail}</div>
                <div style={{ maxWidth: '300px', wordBreak: 'break-word' }}>
                  {comment.text}
                </div>
                <div>{new Date(comment.createdAt).toLocaleDateString()}</div>
                <div>
                  <button
                    onClick={() => handleDeleteComment(comment.id, true)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ff4444",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
  );
};

export default CommentModerPage;