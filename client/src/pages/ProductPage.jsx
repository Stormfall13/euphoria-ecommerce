import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchQnA } from "../store/slices/qnaSlice";
import { fetchComments } from "../store/slices/commentsSlice";

import noPhoto from "../assets/no-photo.png";
import prodLeftSliderBtn from '../assets/prod-left-slider-btn.svg';
import prodRightSliderBtn from '../assets/prod-right-slider-btn.svg';
import starTrue from '../assets/star-true.svg';
import starFalse from '../assets/star-false.svg';
import arrowLeftCrumbs from '../assets/arrow-left-crumbs.svg';
import commentIcon from '../assets/comment__icon.svg';
import arrowSizeRight from '../assets/arrow-size-right.svg';
import cartProduct from '../assets/cart-product.svg';
import inf1 from '../assets/inf1.svg';
import inf2 from '../assets/inf2.svg';
import inf3 from '../assets/inf3.svg';
import inf4 from '../assets/inf4.svg';

import CommentsProdPage from "../components/ProductPageUtils/CommentsProdPage";
import QnAProductPage from "../components/ProductPageUtils/QnAProductPage";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTabProduct, setActiveTabProduct] = useState("description");
  const [hoverRating, setHoverRating] = useState(0); // Для hover эффекта
  const currentCategory = categories.find(cat => cat.id === product.categoryId);
  const { items: comments, loading, error: commentError, success: commentSuccess } = useSelector((state) => state.comments);
  const { items: qna } = useSelector((state) => state.qna);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(false);

  useEffect(() => {
     // Загрузка товара
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error("Ошибка загрузки товара", err));

    // Загрузка категорий
    fetch(`${process.env.REACT_APP_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Ошибка загрузки категорий", err));

    // 🔹 ЗАГРУЗКА КОММЕНТАРИЕВ И QnA СРАЗУ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
    dispatch(fetchComments(id));
    dispatch(fetchQnA(id));

  }, [id, dispatch]);

  // 🔹 КОМПОНЕНТ ЗВЕЗДОЧЕК ДЛЯ РЕЙТИНГА
  const StarRating = ({ currentRating, onRatingChange, editable = true }) => {
    return (
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <img
            key={star}
            src={star <= currentRating ? starTrue : starFalse}
            alt={star <= currentRating ? "Filled star" : "Empty star"}
            style={{ 
              cursor: editable ? "pointer" : "default",
              width: "24px",
              height: "24px"
            }}
            onClick={() => editable && onRatingChange(star)}
            onMouseEnter={() => editable && setHoverRating(star)}
            onMouseLeave={() => editable && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  // 🔹 ВЫЧИСЛЯЕМ СРЕДНИЙ РЕЙТИНГ
  const averageRating = comments.length > 0 
  ? (comments.reduce((sum, comment) => sum + (comment.rating || 0), 0) / comments.length).toFixed(1)
  : 0;

  // Функции для навигации слайдера
  const nextImage = () => {
    const images = product?.images || [];
    if (images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    const images = product?.images || [];
    if (images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

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


  if (!product) return <div>Загрузка...</div>;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : [];

  const currentImage = images.length > 0 
    ? `${process.env.REACT_APP_API_URL}${images[currentImageIndex].startsWith("/") ? "" : "/uploads/"}${images[currentImageIndex]}`
    : noPhoto;


  const dataInformWrapp = [
    {
      id: 1,
      img: inf1,
      text: 'Secure payment',
    },
    {
      id: 2,
      img: inf2,
      text: 'Size & Fit',
    },
    {
      id: 3,
      img: inf3,
      text: 'Free shipping',
    },
    {
      id: 4,
      img: inf4,
      text: 'Free Shipping & Returns',
    },
  ]

  return (
    <section className="wrapp__product-page">
      <div className="product__wrapper-top">
        {/* СЛАЙДЕР С ИЗОБРАЖЕНИЯМИ */}
        <div className="product__slider">
          <div className="slider__control-panel">

            {/* Миниатюры */}
            {images.length > 1 && (
              <div className="thumbnails">
                {images.map((img, index) => (
                  <div className="thumbnails__mini" 
                        key={index} 
                        onClick={() => goToImage(index)}
                        style={{
                          border: `1px solid ${index === currentImageIndex ? "#3C4242" : "transparent"}`
                        }}>
                    <img
                      src={`${process.env.REACT_APP_API_URL}${img.startsWith("/") ? "" : "/uploads/"}${img}`}
                      alt={`Thumbnail ${index + 1}`}/>
                  </div>
                ))}
              </div>
            )}
            {/* Кнопки навигации */}
            {images.length > 1 && (
              <div className="slider__btn-wrapp">
                <button onClick={prevImage}>
                  <img src={prodLeftSliderBtn} alt="Previous"/>
                </button>
                
                <button onClick={nextImage}>
                  <img src={prodRightSliderBtn} alt="Next" />
                </button>
              </div>
            )}
          </div>
          {/* Основное изображение */}
          <div className="main__image-container">
            <img src={currentImage} alt={`${product.nameProd}`}/>
          </div>
        </div>
        <div className="right__wrapp-product">
        <div className="crumbs__wrapp">
          <Link className="text__crumbs" to="/allcategory">Shop</Link>
          {currentCategory && (
            <>
              <span className="arrow__crumbs"><img src={arrowLeftCrumbs} alt="arrow crumbs"/></span>
              <Link className="text__crumbs" to={`/category/${currentCategory.id}`}>
                {currentCategory.collection || currentCategory.name}
              </Link>
            </>
          )}
          <span className="arrow__crumbs"><img src={arrowLeftCrumbs} alt="arrow crumbs"/></span>
          <p className="text__crumbs">{product.nameProd}</p>
        </div>
          <h1 className="name__prod">{product.nameProd}</h1>
            {/* 🔹 СРЕДНИЙ РЕЙТИНГ ТОВАРА */}
            <div>
              <div className="rating__star-wrapp">
                <div className="star__rating">
                  <StarRating currentRating={Math.round(averageRating)} editable={false} />
                  <span>{averageRating}</span>
                </div>
                <div className="comment__rating">
                  <img src={commentIcon} alt="comment icon" />
                  <div className="count__comments">
                    {comments.length} 
                  </div>
                  comments
                </div>
              </div>
            </div>
          {/* Размеры */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="size__wrapp">
              <div className="size__head">
                <h3 className="size__title">Select Size</h3>
                <button className="size__btn">
                  Size Guide
                  <img src={arrowSizeRight} alt="arrow size"/>
                </button>
              </div>
              <div className="size__btn-wrapp">
                {product.sizes.map((size, index) => (
                  <div 
                    className={`size__btn-select ${selectedSize === size ? 'size__selected' : ''}`} 
                    key={index}
                    onClick={() => {
                      if (selectedSize === size) {
                        setSelectedSize(null); // Снимаем выбор
                      } else {
                        setSelectedSize(size); // Выбираем размер
                      }
                    }}>
                  {size}
                </div>
                ))}
              </div>
            </div>
          )}
          {/* Цвета */}
          {product.colors && product.colors.length > 0 && (
            <div className="color__wrapp">
              <h3 className="color__title">Colour Available</h3>
              <div className="color__wrapper-btn">
                {product.colors.map((color, index) => (
                  <div 
                    className={`color__select-btn ${selectedColor === color ? 'col__selected' : ''}`} 
                    key={index} 
                    title={color}
                    style={{ background: color }}
                    onClick={() => {
                      if (selectedColor === color) {
                        setSelectedColor(null); // Снимаем выбор если кликаем повторно
                      } else {
                        setSelectedColor(color); // Выбираем цвет
                      }
                    }}          
                  />
                ))}
              </div>
            </div>
          )}
          <div className="prod__btn-price">
            <button className="btn__add" onClick={handleAddToCart}>
              <img src={cartProduct} alt="cart product" />
              Add to cart
            </button>
            <p className="price__prod">${product.price}</p>
          </div>
          <div className="inform__wrapp">
            {dataInformWrapp.map((items) => (
              <div className="inform__wrapper" key={items.id}>
                  <div className="inform__img">
                    <img src={items.img} alt="inform img" />
                  </div>
                  <p className="inform__text">{items.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="tabs__panel">
        <button onClick={() => setActiveTabProduct('description')}>Description</button>
        <button onClick={() => setActiveTabProduct('userComments')}>
          User Comments
          {comments.length}
        </button>
        <button onClick={() => setActiveTabProduct('qna')}>
          Question & Answer
          {qna.length}
        </button>
      </div>
      {activeTabProduct === 'description' && (
        <>
          {product.description && (
              <p className="description__prod">{product.description}</p>
          )}
        </>
      )}
      {/* КОММЕНТАРИИ */}
      {activeTabProduct === 'userComments' && (
        <CommentsProdPage />
      )}
      {/* ВОПРОС И ОТВЕТ */}
      {activeTabProduct === 'qna' && (
        <QnAProductPage />
      )}
      {error && (
        <div style={{ color: "red", margin: "10px 0" }}>
          {error}
        </div>
      )}
    </section>
  );
};

export default ProductPage;
