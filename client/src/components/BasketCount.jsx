import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import shoppingCart from '../assets/shopping-cart.svg';
import shoppingCartWhite from '../assets/shopping-cart-white.svg';

const BasketCount = () => {
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data.CartItems)) {
        setCart(data);
        const count = data.CartItems.reduce((acc, item) => acc + item.quantity, 0);
        const price = data.CartItems.reduce(
          (acc, item) => acc + item.quantity * (item.Product?.price || 0),
          0
        );
        setTotalCount(count);
        setTotalPrice(price);
      } else {
        setCart({ CartItems: [] });
        setTotalCount(0);
        setTotalPrice(0);
      }
    } catch (err) {
      console.error("Ошибка загрузки корзины:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="basket__wrapp-btn">
      {totalCount ? (
        <Link to="/basket" className="basket__true">
          <img src={shoppingCartWhite} alt="shopping cart icon" />
        </Link>
      ) : (
        <div className="basket__false">
          <img src={shoppingCart} alt="shopping cart icon" />
        </div>
      )}
    </div>
  );
};

export default BasketCount;
