import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavoriteLocally } from "../store/slices/favoriteSlice";
import { Link } from "react-router-dom";
import HeaderMain from '../components/HeaderMain';

import noPhoto from "../assets/no-photo.png";

const ProductPage = () => {
  const dispatch = useDispatch();
  
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");

  const [qna, setQna] = useState([]); // Список вопросов и ответов
  const [questionText, setQuestionText] = useState(""); // Текст нового вопроса
  const [answerTexts, setAnswerTexts] = useState({}); // Тексты ответов: { [questionId]: text }
  const [openAnswerFor, setOpenAnswerFor] = useState(null); // id вопроса, где открыта форма ответа
  const [qnaError, setQnaError] = useState("");
  const [qnaSuccess, setQnaSuccess] = useState("");

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const favoriteIds = useSelector(state => state.favorites.ids);
  
  useEffect(() => {
     // Загрузка товара
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error("Ошибка загрузки товара", err));

    // 🔹 ЗАГРУЗКА КОММЕНТАРИЕВ
    fetch(`${process.env.REACT_APP_API_URL}/api/comments/product/${id}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error("Ошибка загрузки комментариев", err));

    // 🔹 ЗАГРУЗКА ВОПРОСОВ И ОТВЕТОВ
    fetch(`${process.env.REACT_APP_API_URL}/api/qna/product/${id}`)
      .then(res => res.json())
      .then(data => setQna(data))
      .catch(err => console.error("Ошибка загрузки QnA", err));

  }, [id]);

  const handleAddToCart = async () => {
    if (quantity > product.stock) {
      alert(`❌ Недостаточно товаров на складе. Всего доступно: ${product.stock}`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Товар добавлен в корзину");
      } else {
        // console.error("Ошибка добавления", data);
        alert("❌ Не удалось добавить товар в корзину");
      }
      if (!response.ok) {
        if (response.status === 400) {
          setError(data.message); // сообщение от сервера
        } else {
          setError("Ошибка при добавлении в корзину");
        }
        return;
      }
      setError(""); // сброс если всё ок
    } catch (err) {
      console.error("Ошибка при добавлении в корзину", err);
      alert("❌ Произошла ошибка");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > product.stock) {
      alert(`❌ Недостаточно товаров на складе. Всего: ${product.stock}`);
      setQuantity(product.stock);
    } else {
      setQuantity(value);
    }
  };

  const handleCommentSubmit = async (e) => {
      e.preventDefault();
      setCommentError("");
      setCommentSuccess("");

      if (!commentText.trim()) {
          setCommentError("Введите текст комментария");
          return;
      }

      // Проверка для гостей
      if (!token && (!guestName.trim() || !guestEmail.trim())) {
          setCommentError("Для гостей обязательны имя и email");
          return;
      }

      try {
          const payload = {
              productId: id,
              text: commentText,
          };

          // Добавляем данные пользователя или гостя
          if (token && user) {
              payload.userId = user.id;
          } else {
              payload.guestName = guestName;
              payload.guestEmail = guestEmail;
          }

          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/comments`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  ...(token && { Authorization: `Bearer ${token}` }), // Добавляем токен, если есть
              },
              body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (response.ok) {
              setCommentSuccess("Комментарий отправлен на модерацию!");
              setCommentText("");
              setGuestName("");
              setGuestEmail("");
          } else {
              setCommentError(data.message || "Ошибка при отправке комментария");
          }
      } catch (err) {
          console.error("Ошибка:", err);
          setCommentError("Произошла ошибка при отправке");
      }
  };

  const handleDeleteQnA = async (id) => {
    if (!token) return;
    if (!window.confirm("Удалить? Все ответы тоже будут удалены.")) return;
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/qna/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        // Убираем удалённый элемент из состояния
        setQna(prev => prev.filter(q => q.id !== id && q.parentId !== id));
      } else {
        alert(data.message || "Ошибка при удалении");
      }
    } catch (err) {
      console.error("Ошибка при удалении", err);
    }
  };

  // Функция для отправки вопроса
  const handleAskQuestion = async (e) => {
      e.preventDefault();
      if (!questionText.trim()) {
          setQnaError("Введите вопрос");
          return;
      }
      if (!token) {
          setQnaError("Необходимо войти в систему");
          return;
      }

      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/qna`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                  productId: id,
                  text: questionText,
                  // parentId не передаем - это вопрос
              }),
          });

          const data = await response.json();
          if (response.ok) {
              setQnaSuccess("Вопрос задан!");
              setQuestionText("");
              setQna(prev => [{ ...data, answers: [] }, ...prev]); 
          } else {
              setQnaError(data.message || "Ошибка");
          }
      } catch (err) {
          console.error("Ошибка:", err);
          setQnaError("Ошибка при отправке вопроса");
      }
  };

  // Функция для отправки ответа
  const handleSubmitAnswer = async (questionId) => {
      const text = answerTexts[questionId] || "";
      if (!text.trim()) {
          setQnaError("Введите ответ");
          return;
      }

      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/qna`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                  productId: id,
                  text: text,
                  parentId: questionId, // Указываем, что это ответ на конкретный вопрос
              }),
          });

          const data = await response.json();
          if (response.ok) {
            setQnaSuccess("Ответ добавлен!");
            setAnswerTexts(prev => ({ ...prev, [questionId]: "" }));
            setQna(prevQna =>
              prevQna.map(item =>
                item.id === questionId
                  ? { ...item, answers: [ ...(item.answers || []), data ] }
                  : item
              )
            );
            setOpenAnswerFor(null); // закрываем раскрытый вопрос
          } else {
              setQnaError(data.message || "Ошибка");
          }
      } catch (err) {
          console.error("Ошибка:", err);
          setQnaError("Ошибка при отправке ответа");
      }
  }; 

  const toggleFavorite = async (productId) => {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Для добавления в избранное нужно войти");
          return;
      }

      const isFavorite = favoriteIds.includes(productId);

      try {
          const response = await fetch(
              `${process.env.REACT_APP_API_URL}/api/favorites/${isFavorite ? 'remove/' : 'add/'}${productId}`,
              {
                  method: isFavorite ? "DELETE" : "POST",
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                  },
              }
          );

          if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || "Ошибка работы с избранным");
          }

          dispatch(toggleFavoriteLocally(productId));
      } catch (err) {
          alert(err.message);
      }
  };

  if (!product) return <div>Загрузка...</div>;

  return (
    <>
    <HeaderMain />
    <div style={{ padding: 20 }} className="wrapp__product-page">
      <h1>{product.nameProd}</h1>
      {/* Обертка для всех изображений */}
      <div className="wrapp" style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "20px",
        marginBottom: "20px"
      }}>
        {/* Если есть images, выводим их все */}
        {product.images && product.images.length > 0 ? (
          product.images.map((img, index) => (
            <div key={index} className="wrapper" style={{
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "10px",
              width: "300px"
            }}>
              <img
                src={`${process.env.REACT_APP_API_URL}${img.startsWith("/") ? "" : "/uploads/"}${img}`}
                alt={`${product.nameProd} - ${index + 1}`}
                style={{ 
                  width: "100%",
                  height: "auto",
                  objectFit: "contain"
                }}
              />
            </div>
          ))
        ) : (
          // Если нет images, выводим product.image или заглушку
          <div className="wrapper" style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "10px",
            width: "300px"
          }}>
            <img
              src={product.image ? `${process.env.REACT_APP_API_URL}${product.image}` : noPhoto}
              alt={product.nameProd}
              style={{ 
                width: "100%",
                height: "auto",
                objectFit: "contain"
              }}
            />
          </div>
        )}
      </div>
      <p><strong>Количество на складе:</strong> {product.stock}</p>
      <p><strong>Цена:</strong> {product.price} $</p>
      <p><strong>Категория:</strong> {product.Category?.name || "Без категории"}</p>
      <div>{product.isHit ? 'Хит' : ''}</div>
      <div>{product.isNew ? 'Новинка' : ''}</div>
      <div>{product.isSale ? 'Акция' : ''}</div>
      {/* Размеры */}
      {product.sizes && product.sizes.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Размеры:</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {product.sizes.map((size, index) => (
              <div 
                key={index}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  backgroundColor: "#f5f5f5"
                }}
              >
                {size}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Цвета */}
      {product.colors && product.colors.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Цвета:</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {product.colors.map((color, index) => (
              <div 
                key={index}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  backgroundColor: color,
                  border: "1px solid #ddd",
                  cursor: "pointer"
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
      {product.description && (
          <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>{product.description}</p>
      )}
      {/* 🔹 ФОРМА КОММЕНТАРИЯ */}
      <div className="comments__modules">
          <h3>Оставить отзыв</h3>
          {commentSuccess && <p style={{ color: "green" }}>{commentSuccess}</p>}
          {commentError && <p style={{ color: "red" }}>{commentError}</p>}
          <form onSubmit={handleCommentSubmit}>
              {/* Поля для гостей */}
              {!token && (
                  <>
                      <input
                          type="text"
                          placeholder="Ваше имя"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          style={{ marginBottom: "10px", padding: "8px", width: "100%", maxWidth: "300px" }}
                      />
                      <input
                          type="email"
                          placeholder="Ваш email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          style={{ marginBottom: "10px", padding: "8px", width: "100%", maxWidth: "300px" }}
                      />
                  </>
              )}
              <textarea
                  placeholder="Ваш отзыв..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                  style={{ width: "100%", maxWidth: "500px", padding: "8px", marginBottom: "10px" }}
              />
              <br />
              <button type="submit">Отправить</button>
          </form>
      </div>

      {/* 🔹 СПИСОК КОММЕНТАРИЕВ */}
      <div style={{ marginTop: "40px" }}>
          <h3>Отзывы ({comments.length})</h3>
          {comments.length === 0 ? (
              <p>Пока нет отзывов.</p>
          ) : (
              comments.map((comment) => (
                  <div key={comment.id} style={{ 
                      border: "1px solid #ddd", 
                      padding: "15px", 
                      marginBottom: "15px", 
                      borderRadius: "5px" 
                  }}>
                      <strong>
                          {comment.User ? comment.User.name : comment.guestName}
                      </strong>
                      <span style={{ color: "gray", fontSize: "0.9em", marginLeft: "10px" }}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      <p style={{ marginTop: "10px" }}>{comment.text}</p>
                  </div>
              ))
          )}
      </div>
      {/* 🔹 РАЗДЕЛ ВОПРОСОВ И ОТВЕТОВ */}
      <div>
          <h3>Вопросы и ответы ({qna.length})</h3>
          {qnaError && <p style={{ color: "red" }}>{qnaError}</p>}
          {qnaSuccess && <p style={{ color: "green" }}>{qnaSuccess}</p>}

          {/* Форма задания вопроса */}
          <div style={{ marginBottom: "30px" }}>
              <h4>Задать вопрос</h4>
              {token ? (
                  <form onSubmit={handleAskQuestion}>
                      <textarea
                          placeholder="Ваш вопрос о товаре..."
                          value={questionText}
                          onChange={(e) => setQuestionText(e.target.value)}
                          rows={3}
                          style={{ width: "100%", maxWidth: "500px", padding: "8px" }}
                      />
                      <br />
                      <button type="submit" style={{ marginTop: "10px" }}>Спросить</button>
                  </form>
              ) : (
                  <p>Чтобы задать вопрос, пожалуйста, <Link to="/login">войдите</Link> в систему.</p>
              )}
          </div>

          {/* Список вопросов */}
          {qna.length === 0 ? (
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
                            {/* Крестик только для админа */}
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
                                          от {user.username} / роль: {user.role}, {new Date(answer.createdAt).toLocaleDateString()}
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
                      {/* Форма ответа (кнопка -> по клику открываем/закрываем) */}
                      {token ? (
                        <>
                          <button
                            style={{ marginTop: "10px" }}
                            onClick={() =>
                              setOpenAnswerFor(prev => (prev === question.id ? null : question.id))
                            }
                          >
                            {openAnswerFor === question.id ? "Отменить" : "Ответить"}
                          </button>

                          {openAnswerFor === question.id && (
                            <div style={{ marginTop: "10px" }}>
                              <textarea
                                placeholder="Ваш ответ..."
                                value={answerTexts[question.id] || ""}
                                onChange={(e) =>
                                  setAnswerTexts(prev => ({ ...prev, [question.id]: e.target.value }))
                                }
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
      <Link className='prod__brand' to={`/brand/${product.brand}`}>{product.brand}</Link>
      <button onClick={() => toggleFavorite(product.id)}>
          {favoriteIds.includes(product.id) ? "★ В избранном" : "☆ В избранное"}
      </button>
      <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
        <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} disabled={quantity <= 1}>-</button>
        <input
          type="text"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={handleQuantityChange}
          style={{ margin: "0 10px", width: 60, textAlign: "center" }}
        />
        <button onClick={() => {
          if (quantity < product.stock) setQuantity(prev => prev + 1);
          else alert(`❌ Недостаточно товаров на складе. Всего: ${product.stock}`);
        }}>
          +
        </button>
      </div>
      {error && (
        <div style={{ color: "red", margin: "10px 0" }}>
          {error}
        </div>
      )}
      <button
        onClick={handleAddToCart}
        style={{ marginTop: 20, padding: "10px 20px" }}
      >
        Добавить в корзину
      </button>
    </div>
    </>
  );
};

export default ProductPage;
