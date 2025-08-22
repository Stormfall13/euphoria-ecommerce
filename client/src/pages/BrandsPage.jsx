import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';

const BrandsPage = () => {
  const { brandName } = useParams(); // Получаем название бренда из URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        // Эндпоинт на бэкенде для фильтрации по бренду
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/brand/${encodeURIComponent(brandName)}`);
        if (!response.ok) {
          throw new Error('Ошибка загрузки товаров бренда');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Ошибка:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProducts();
  }, [brandName]); // Зависимость от brandName

  if (loading) {
    return <div><Header />Загрузка...</div>;
  }

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Товары бренда: {brandName}</h1>
        
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={
                      product.images?.length > 0
                        ? `${process.env.REACT_APP_API_URL}${product.images[0]}`
                        : "/no-photo.png"
                    }
                    alt={product.nameProd}
                  />
                  <h3>{product.nameProd}</h3>
                  <p>{product.price} ₽</p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>Товары бренда {brandName} не найдены.</p>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;