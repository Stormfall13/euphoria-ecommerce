import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import noPhoto from "../assets/no-photo.png";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error("Ошибка загрузки товара", err));
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

  if (!product) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{product.nameProd}</h1>
      <img
        src={product.image ? `${process.env.REACT_APP_API_URL}${product.image}` : noPhoto}
        alt={product.nameProd}
        width="300"
      />
      <p><strong>Количество на складе:</strong> {product.stock}</p>
      <p><strong>Цена:</strong> {product.price} $</p>
      <p><strong>Категория:</strong> {product.Category?.name || "Без категории"}</p>
      <div>{product.isHit ? 'Хит' : ''}</div>
      <div>{product.isNew ? 'Новинка' : ''}</div>
      <div>{product.isSale ? 'Акция' : ''}</div>
      
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
  );
};

export default ProductPage;
