import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import noPhoto from "../assets/no-photo.png";
import HeaderMain from "../components/HeaderMain";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setFavorites(data);
    } catch (error) {
      console.error("Ошибка при загрузке избранного:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/favorites/remove/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setFavorites(favorites.filter(fav => fav.Product.id !== productId));
      } else {
        console.error("Ошибка при удалении из избранного");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const removeAllFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const results = await Promise.all(
        favorites.map(fav => 
          fetch(`${process.env.REACT_APP_API_URL}/api/favorites/remove/${fav.Product.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      if (results.every(res => res.ok)) {
        setFavorites([]);
      } else {
        console.error("Ошибка при удалении некоторых товаров");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <p>Загрузка...</p>;

  return (
    <>
    <HeaderMain />
    <div>
    <h2>Избранные товары</h2>
    {favorites.length > 0 && (
      <button 
        onClick={removeAllFavorites}
        style={{
          padding: "8px 16px",
          backgroundColor: "#ff4444",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Удалить все
      </button>
    )}
    {favorites.length === 0 ? (
        <p>Нет избранных товаров.</p>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "20px" 
        }}>
          {favorites.map((fav) => (
            <div key={fav.id} >
              {/* Кнопка удаления для каждого товара */}
              <button onClick={() => removeFavorite(fav.Product.id)}>X</button>
              <Link 
                to={`/product/${fav.Product?.id}`} 
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {/* Главное изображение (первое из массива или product.image) */}
                <div style={{ 
                  height: "200px", 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center",
                  marginBottom: "15px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "4px"
                }}>
                  <img
                    src={
                      fav.Product?.images?.length > 0 
                        ? `${process.env.REACT_APP_API_URL}${fav.Product.images[0]}`
                        : fav.Product?.image 
                          ? `${process.env.REACT_APP_API_URL}${fav.Product.image}`
                          : noPhoto
                    }
                    alt={fav.Product?.name}
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: "100%",
                      objectFit: "contain"
                    }}
                  />
                </div>

                <h3 style={{ margin: "10px 0" }}>{fav.Product?.name}</h3>
                <p style={{ 
                  fontSize: "18px", 
                  fontWeight: "bold",
                  margin: "10px 0"
                }}>
                  {fav.Product?.price} $
                </p>

                {/* Бейджики (хит, новинка, акция) */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  {fav.Product?.isHit && (
                    <span style={{ 
                      background: "#ffebee", 
                      color: "#c62828",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "12px"
                    }}>
                      Хит
                    </span>
                  )}
                  {fav.Product?.isNew && (
                    <span style={{ 
                      background: "#e8f5e9", 
                      color: "#2e7d32",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "12px"
                    }}>
                      Новинка
                    </span>
                  )}
                  {fav.Product?.isSale && (
                    <span style={{ 
                      background: "#fff8e1", 
                      color: "#ff8f00",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "12px"
                    }}>
                      Акция
                    </span>
                  )}
                </div>

                {/* Размеры */}
                {fav.Product?.sizes?.length > 0 && (
                  <div style={{ margin: "10px 0" }}>
                    <p style={{ marginBottom: "5px", fontSize: "14px" }}>Размеры:</p>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {fav.Product.sizes.map((size, index) => (
                        <span 
                          key={index}
                          style={{
                            padding: "3px 8px",
                            background: "#f5f5f5",
                            borderRadius: "4px",
                            fontSize: "12px"
                          }}
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Цвета */}
                {fav.Product?.colors?.length > 0 && (
                  <div style={{ margin: "10px 0" }}>
                    <p style={{ marginBottom: "5px", fontSize: "14px" }}>Цвета:</p>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {fav.Product.colors.map((color, index) => (
                        <div 
                          key={index}
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: color,
                            border: "1px solid #ddd"
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Favorites;
