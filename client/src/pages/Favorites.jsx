import React, { useEffect, useState } from "react";

import noPhoto from "../assets/no-photo.png";

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

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
    <h2>Избранные товары</h2>
      {favorites.length === 0 ? (
        <p>Нет избранных товаров.</p>
      ) : (
        <ul>
          {favorites.map((fav) => (
            <li key={fav.id}>
              <h3>{fav.Product?.name}</h3>
              <p>{fav.Product?.description}</p>
              <p>Цена: {fav.Product?.price} сум</p>
              <img
                src={fav.Product.image ? `${process.env.REACT_APP_API_URL}${fav.Product.image}` : noPhoto}
                alt={fav.Product.name}
                width="150"
              />
            </li>
          ))}
        </ul>
      )} 
    </div>
  );
};

export default Favorites;
