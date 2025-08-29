import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavoriteLocally } from "../store/slices/favoriteSlice";

import heartCardBrown from '../assets/heart-card-brown.svg';
import heartCardWhite from '../assets/heart-card-white.svg';

import '../scss/limelight.css';

const limelightParams = {
    title: 'In The Limelight',
    hidden: false,
}

const Limelight = () => {
    const dispatch = useDispatch();

    const [products, setProducts] = useState([]);
    const favoriteIds = useSelector(state => state.favorites.ids);
    
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/products/isnews`)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Ошибка загрузки новинок", err));
    }, []);

    const toggleFavorite = async (productId) => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Для добавления в избранное нужно войти");
        return;
      }

      const isFavorite = favoriteIds.includes(productId);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/favorites/${
            isFavorite ? "remove/" : "add/"
          }${productId}`,
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

    return (
        <>
        {limelightParams.hidden ? ('') : (
            <section className='limelight'>
                <div className="limelight__title">{limelightParams.title}</div>
                <div className="limelight__wrapp">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="limelight__item">
                            <div className="limelight__btn">
                                <button onClick={() => toggleFavorite(product.id)} className='limelight__fav-btn'>
                                    {favoriteIds.includes(product.id) ? (
                                        <div className="fav__true">
                                            <img src={heartCardWhite} alt="heart cart white" />
                                        </div>
                                    ) : (
                                        <div className="fav__false">
                                            <img src={heartCardBrown} alt='heart cart brown' />
                                        </div>
                                    )}
                                </button>
                            </div>
                            <div className="prod__img">
                                <img
                                    src={
                                        product.images?.length > 0
                                            ? `${process.env.REACT_APP_API_URL}${product.images[0]}`
                                            : "/no-photo.png"
                                    }
                                    alt={product.nameProd}/>
                            </div>
                            <div className="prod__items">
                                <div className="prod__name-brand">
                                    <Link className='prod__name' to={`/product/${product.id}`}>{product.nameProd}</Link>
                                    <Link className='prod__brand' to={`/brand/${product.brand}`}>
                                    {product.brand}</Link>
                                </div>
                                <p className='prod__price'>${product.price}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Новинок пока нет</p>
                )}
                </div>
            </section>
        )}
        </>
    )
}

export default Limelight;