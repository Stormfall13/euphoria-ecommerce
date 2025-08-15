import { useEffect, useState } from "react";
import { useNavigate ,Link } from "react-router-dom";
import noPhoto from "../assets/no-photo.png";

const BasketPage = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState({});

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      // if (response.ok) setCart(data);
      if (response.ok) {
        setCart(data);
        const initialQuantities = {};
        data.CartItems.forEach(item => {
          initialQuantities[item.Product.id] = item.quantity;
        });
        setQuantities(initialQuantities);
      }
      else console.error("Ошибка загрузки корзины", data);
    } catch (err) {
      console.error("Ошибка при получении корзины:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQty, maxStock) => {
    if (newQty < 1) return; // нельзя меньше 1
    if (newQty > maxStock) {
      alert(`Недостаточно товара на складе. Всего: ${maxStock}`);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: newQty }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setQuantities((prev) => ({ ...prev, [productId]: newQty }));
        fetchCart(); // можно убрать, если точно знаем, что всё ок
      } else {
        console.error("Ошибка обновления количества", data);
        alert(data.message || "Ошибка обновления");
      }
    } catch (err) {
      console.error("Ошибка при обновлении:", err);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Товар удалён из корзины");
        fetchCart(); // обновим корзину
      } else {
        console.error("Ошибка удаления товара", data);
      }
    } catch (err) {
      console.error("Ошибка при удалении товара:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Корзина очищена");
        fetchCart(); // обновим
      } else {
        console.error("Ошибка очистки корзины", data);
      }
    } catch (err) {
      console.error("Ошибка при очистке корзины:", err);
    }
  };

  if (!cart) return <div>Загрузка корзины...</div>;
  const totalPrice = cart.CartItems.reduce((sum, item) => {
    return sum + item.Product.price * item.quantity;
  }, 0);
  if (!Array.isArray(cart.CartItems) || cart.CartItems.length === 0) return <div>Корзина пуста.</div>;

  return (
    <div>
      <h1>Корзина</h1>
      <ul>
        {cart.CartItems.map((item) => (
          <li key={item.id}>
            <h3>
            <Link to={`/product/${item.Product.id}`}>
                {item.Product?.nameProd || "Без названия"}
            </Link>
            </h3>
            <p>Цена: {item.Product?.price || "?"} $</p>
            <p>Кол-во: {item.quantity}</p>
            <img
              src={item.Product?.image ? `${process.env.REACT_APP_API_URL}${item.Product.image}` : noPhoto}
              alt={item.Product?.nameProd}
              width="150"
            />
            <br />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={() => updateQuantity(item.Product.id, quantities[item.Product.id] - 1, item.Product.stock)}>-</button>
              
              <input
                type="text"
                value={quantities[item.Product.id] || 1}
                min={1}
                max={item.Product.stock}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (val >= 1 && val <= item.Product.stock) {
                    updateQuantity(item.Product.id, val, item.Product.stock);
                  }
                }}
                style={{ width: "50px", textAlign: "center" }}
              />

              <button onClick={() => updateQuantity(item.Product.id, quantities[item.Product.id] + 1, item.Product.stock)}>+</button>
            </div>
            <button onClick={() => navigate('/')}>
                Продолжить покупики
            </button>
            <button onClick={() => handleRemoveItem(item.Product.id)}>
              Удалить товар
            </button>
          </li>
        ))}
      </ul>
      <h2>Итого: {totalPrice.toFixed(2)} $</h2>
      <button onClick={handleClearCart} style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}>
        Очистить корзину
      </button>
    </div>
  );
};

export default BasketPage;
