import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryById } from "../store/slices/categorySlice";
import { fetchProductsByCategory } from "../store/slices/productsSlice";
import { fetchFavorites, toggleFavoriteLocally } from "../store/slices/favoriteSlice";
import { addToCart } from "../store/slices/cartSlice";
import { setInitialQuantities, increaseQuantity, decreaseQuantity, changeQuantity } from "../store/slices/quantitySlice";
import noPhoto from "../assets/no-photo.png";
import './categoryPage.css';

const CategoryPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const category = useSelector(state => state.category.data);
    const products = useSelector(state => state.products.list);
    const favoriteIds = useSelector(state => state.favorites.ids);

    const quantities = useSelector(state => state.quantities);

    useEffect(() => {
        dispatch(fetchCategoryById(id));
        dispatch(fetchProductsByCategory(id)).then((res) => {
            const initialQuantities = {};
            res.payload.forEach(prod => {
                initialQuantities[prod.id] = 1;
            });
            dispatch(setInitialQuantities(initialQuantities));
        });

        const token = localStorage.getItem("token");
        if (token) dispatch(fetchFavorites());
    }, [id, dispatch]);

    const handleAddToCart = async (productId, stock) => {
        const quantity = quantities[productId] || 1;
        if (quantity > stock) {
            alert(`Недостаточно товара на складе. Всего: ${stock}`);
            return;
        }
    
        dispatch(addToCart({ productId, quantity }))
            .unwrap()
            .then(() => {
                alert("Товар добавлен в корзину");
            })
            .catch((err) => {
                alert(err);
            });
    };

    const handleIncrease = (id, stock) => {
        dispatch(increaseQuantity({ productId: id, stock }));
    };
    
    const handleDecrease = (id) => {
        dispatch(decreaseQuantity({ productId: id }));
    };
    
    const handleQuantityChange = (e, id, stock) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value)) return;
        dispatch(changeQuantity({ productId: id, quantity: value, stock }));
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

    return (
        <div>
            <h1>{category ? category.name : "Загрузка..."}</h1>

            {favoriteIds.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    <Link to="/favorites">Перейти в избранное ({favoriteIds.length})</Link>
                </div>
            )}

            <div className="wrapp__prod" style={{ display: "flex", flexWrap: "wrap" }}>
                {products.map((product) => (
                    <div key={product.id} className="wrapper__prod" style={{ maxWidth: "300px", width: "100%" }}>
                        <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <h3>{product.nameProd}</h3>
                            <p>Цена: {product.price} $</p>
                            <img
                                src={product.image ? `${process.env.REACT_APP_API_URL}${product.image}` : noPhoto}
                                alt={product.nameProd}
                                width="200"
                            />
                            <div>{product.isHit ? 'Хит' : ''}</div>
                            <div>{product.isNew ? 'Новинка' : ''}</div>
                            <div>{product.isSale ? 'Акция' : ''}</div>
                            <p>На складе: {product.stock}</p>
                        </Link>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <button onClick={() => handleDecrease(product.id)}>-</button>
                            <input
                            type="text"
                            value={quantities[product.id] || 1}
                            onChange={(e) => handleQuantityChange(e, product.id, product.stock)}
                            style={{ width: 50 }}
                            />

                            <button onClick={() => handleIncrease(product.id, product.stock)}>+</button>
                        </div>

                        <button onClick={() => toggleFavorite(product.id)}>
                            {favoriteIds.includes(product.id) ? "★ В избранном" : "☆ В избранное"}
                        </button>

                        <button onClick={() => handleAddToCart(product.id, product.stock)}>Добавить в корзину</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;