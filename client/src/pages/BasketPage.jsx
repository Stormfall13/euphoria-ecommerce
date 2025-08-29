import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import noPhoto from "../assets/no-photo.png";
import arrowLeftCrumbs from "../assets/arrow-left-crumbs.svg";
import bucketBtn from "../assets/bucket-btn.svg";
import bucketPlus from "../assets/bucket-plus.svg";
import bucketMinus from "../assets/bucket-minus.svg";
import emptyBasket from "../assets/backet-empty.png";

import '../scss/backetPage.css';

const BasketPage = () => {
  const [cart, setCart] = useState(null);
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


  if (!cart) return <div>Загрузка корзины...</div>;

  const totalPrice = cart.CartItems.reduce((sum, item) => {
    return sum + item.Product.price * item.quantity;
  }, 0);

  if (!Array.isArray(cart.CartItems) || cart.CartItems.length === 0) return(
    <div className="empty__wrapp">
      <div className="empy__img">
        <img src={emptyBasket} alt="empty img" />
      </div>
      <div className="empty__text-wrapp">
        <p className="empty__title">Your cart is empty and sad :(</p>
        <p className="empty__text">Add something to make it happy!</p>
      </div>
      <Link className="empty__link" to="/">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="backet__wrapp">
      <div className="backet__head-wrapp">
        <div className="head__crumbs">
          <Link className="link__crumbs" to="/">Home</Link>
          <div className="crumbs__arrow">
            <img src={arrowLeftCrumbs} alt="arrow crumbs" />
          </div>
          <h1 className="page__title">Add To Cart</h1>
        </div>
        <div className="header__text">
            <p className="text__text">Please fill in the fields below and click place order to complete your purchase!</p>
            <p className="text__link">Already registered? <Link className="link__login" to="/login">Please login here</Link></p>
        </div>
      </div>
      <div className="titles__prod">
        <div className="titles__wrapp">
            <p>PRODUCT DETAILS</p>
            <div className="titles__second">
              <p>PRICE</p>
              <p>QUANTITY</p>
              <p>SHIPPING</p>
              <p>SUBTOTAL</p>
              <p>ACTION</p>
            </div>
        </div>
      </div>
      <div className="backet">
        <div className="backet__prod-wrapp">
          {cart.CartItems.map((item) => (
            <div key={item.id} className="backet__prod">
              <div className="prod__details">
                <div className="prod__img">
                  <img
                    src={
                      item.Product?.images && item.Product.images.length > 0
                        ? `${process.env.REACT_APP_API_URL}${item.Product.images[0]}`
                        : noPhoto
                    }
                    alt={item.Product?.nameProd}/>
                </div>
                <div className="details__items">
                  <Link className="prod__name" to={`/product/${item.Product.id}`}>
                    {item.Product?.nameProd || "Без названия"}
                  </Link>
                  <div className="color__prod">
                    Color:
                    {item.Product.colors && item.Product.colors.map((color, index) => (
                      <div 
                        className="colors" 
                        key={index} 
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="size__prod">
                    Size: 
                    {item.Product.sizes && item.Product.sizes.map((size, index) => (
                      <div className="sizes" key={index}>{size}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="backet__prod-second">
                <p className="prod__price">${item.Product?.price || "?"}</p>
                <div className="quantity__wrapp">
                  <button onClick={() => updateQuantity(item.Product.id, quantities[item.Product.id] - 1, item.Product.stock)}>
                      <img src={bucketMinus} alt="minus" />
                  </button>
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
                    }}/>
                  <button onClick={() => updateQuantity(item.Product.id, quantities[item.Product.id] + 1, item.Product.stock)}>
                    <img src={bucketPlus} alt="plus" />
                  </button>
                </div>
                <div className="shipping">
                  FREE
                </div>
                <p className="prod__price">${item.Product?.price || "?"}</p>
                <button className="btn__delete" onClick={() => handleRemoveItem(item.Product.id)}>
                  <img src={bucketBtn} alt="bucket btn" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        <div className="backet__footer">
          <div className="backet__footer-wrapp">
            <div className="backet__footer-left">
              <div className="head__left">
                <p className="title__left">Discount Codes</p>
                <p className="subtitle">Enter your coupon code if you have one</p>
              </div>
              <form className="head__form">
                <input type="text" />
                <button>Apply Coupon</button>
              </form>
              <Link className="footer__left-link" to="/">Continue Shopping</Link>
            </div>
            <div className="backet__footer-right">
              <div className="over__total">
                <div className="subtotal__shipping">
                  <p>Sub Total: <span>${totalPrice.toFixed(2)}</span></p>
                  <p>Shipping: <span>$5.00</span></p>
                </div>
                <p className="grand__total">Grand Total: <span>${totalPrice.toFixed(2)}</span></p>
              </div>
              <button className="last__btn">Proceed To Checkout</button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default BasketPage;
