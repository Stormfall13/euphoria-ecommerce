import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import HeaderMain from "../components/HeaderMain";

const AdminPage = () => {
    const navigate = useNavigate();

    const [nameProd, setNameProd] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [stock, setStock] = useState("0")
    const [brand, setBrand] = useState("");
    const [images, setImages] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [allImages, setAllImages] = useState([]);
    const [description, setDescription] = useState(""); 
    
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [categoryImage, setCategoryImage] = useState("");
    const [categoryCollection, setCategoryCollection] = useState("");

    const [categories, setCategories] = useState([]);

    const [productOverlay, setProductOverlay] = useState(false);
    const [selectedImagesInOverlay, setSelectedImagesInOverlay] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [categoryOverlay, setCategoryOverlay] = useState(false);

    const [isHit, setIsHit] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [isSale, setIsSale] = useState(false);

    const [comments, setComments] = useState([]);
    const [activeTab, setActiveTab] = useState("products");
    
    
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            nameProd,
            description,
            price,
            categoryId,
            brand,
            images,
            sizes,
            colors,
            stock,
            isHit,
            isNew,
            isSale,
        };
        
        console.log("📤 JSON отправки:", JSON.stringify(payload, null, 2));
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log("Товар добавлен:", data);

        setNameProd("")
        setDescription("")
        setPrice("")
        setCategoryId("")
        setBrand("")
        setImages([])
        setSizes([])
        setColors([])
        setStock("")
        setIsHit(false)
        setIsNew(false)
        setIsSale(false)
    };


    const handleCategorySubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: categoryName,
                    description: categoryDescription,
                    image: categoryImage,
                    collection: categoryCollection,
                }),
            });

            if (!response.ok) throw new Error("Ошибка при добавлении категории");

            const data = await response.json();
            console.log("Категория добавлена:", data);
            setCategoryName("");
            setCategoryDescription("");
            setCategoryImage("");
            setCategoryCollection("");
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };


    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (!user) return; // Ждём, пока загрузится пользователь

        if (user.role !== "admin") {
            navigate("/"); // Нет прав — перенаправляем на главную
            return;
        }

        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
                if (!res.ok) throw new Error("Ошибка загрузки категорий");
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error("Ошибка категорий:", error);
            }
        };
        
        const fetchImages = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/images`);
                if (!res.ok) throw new Error("Ошибка загрузки изображений");
                const data = await res.json();
                setAllImages(data);
            } catch (error) {
                console.error("Ошибка:", error);
            }
        };

        const fetchAllData = async () => {
            await fetchCategories();
            await fetchImages();
            await fetchCommentsForModeration(); // Загружаем комментарии
        };

        fetchAllData();

    }, [token, user, navigate]);


    if (!user) {
        return <h2>Загрузка...</h2>;
    }
    

    const addImage = () => setImages([...images, ""]);
    const updateImage = (i, val) => {
        const newArr = [...images];
        newArr[i] = val;
        setImages(newArr);
    };

    const addSize = () => setSizes([...sizes, ""]);
    const updateSize = (i, val) => {
        const newArr = [...sizes];
        newArr[i] = val;
        setSizes(newArr);
    };

    const addColor = () => setColors([...colors, ""]);
    const updateColor = (i, val) => {
        const newArr = [...colors];
        newArr[i] = val;
        setColors(newArr);
    };

    // выбор для товара (множественный выбор)
    const toggleProductImageSelection = (imgPath) => {
        setSelectedImagesInOverlay(prev => {
            if (prev.includes(imgPath)) {
                return prev.filter(path => path !== imgPath);
            } else {
                return [...prev, imgPath];
            }
        });
    };

    const confirmProductImagesSelection = () => {
        setImages(prev => {
            const newImages = [...prev];
            selectedImagesInOverlay.forEach(img => {
                if (!newImages.includes(img)) {
                    newImages.push(img);
                }
            });
            return newImages;
        });
        setSelectedImagesInOverlay([]);
        setProductOverlay(false);
    };

    const selectProductImage = (imgPath) => {
        if (selectedImageIndex !== null) {
            const newArr = [...images];
            newArr[selectedImageIndex] = imgPath;
            setImages(newArr);
        }
        setSelectedImageIndex(null);
        setProductOverlay(false);
    };

    // выбор для категории
    const selectCategoryImage = (imgPath) => {
        setCategoryImage(imgPath);
        setCategoryOverlay(false);
    };


    // 🔹 Функция для загрузки комментариев на модерацию
    const fetchCommentsForModeration = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/comments/moderation`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Ошибка загрузки комментариев");
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error("Ошибка загрузки комментариев:", error);
            alert("Не удалось загрузить комментарии");
        }
    };

    // 🔹 Функция для публикации комментария
    const handlePublishComment = async (commentId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/comments/${commentId}/publish`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Комментарий опубликован!");
                // Обновляем список, удаляя опубликованный комментарий
                setComments(comments.filter(comment => comment.id !== commentId));
            } else {
                alert("Ошибка при публикации");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось опубликовать комментарий");
        }
    };

    // 🔹 Функция для удаления комментария
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Удалить этот комментарий?")) {
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Комментарий удален!");
                // Обновляем список, удаляя комментарий
                setComments(comments.filter(comment => comment.id !== commentId));
            } else {
                alert("Ошибка при удалении");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось удалить комментарий");
        }
    };
    

    return (
        <div className="admin-container">
            <HeaderMain />
            <Link to="/gallery">
                Перейти в галерею
            </Link>
            <Link to='/all-users'>
                Страница пользователей
            </Link>
            <h1>Админ-панель</h1>



            <h2>Добавить категорию</h2>
            <form onSubmit={handleCategorySubmit}>
                <input
                    type="text"
                    placeholder="Название категории"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                />
                <input
                    placeholder="Описание категории"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="man, women, children"
                    value={categoryCollection}
                    onChange={(e) => setCategoryCollection(e.target.value)}
                />
                <input type="text" placeholder="ссылка изображения" value={categoryImage} onChange={(e) => setCategoryImage(e.target.value)} />
                <div className="gallery__selected">
                    <button type="button" onClick={() => setCategoryOverlay(true)}>Добавить из Галереи</button> 
                    {categoryImage ? (
                    <div className="selected__image" style={{ maxWidth: 100, maxHeight: 100 }}>
                        <img
                        src={`${process.env.REACT_APP_API_URL}${categoryImage.startsWith("/") ? "" : "/uploads/"}${categoryImage}`}
                        alt="Выбранное изображение"
                        style={{ width: "100%" }}
                        />
                    </div>
                    ) : (
                    <p>Изображение не выбрано</p>
                    )}
                </div>
                <button type="submit">Добавить категорию</button>
            </form>

            <div>
            <h2>Добавить товар</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Название" value={nameProd} onChange={(e) => setNameProd(e.target.value)} required />
                    <input type="number" placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    <input 
                        type="text" 
                        placeholder="Бренд (например, Nike)" 
                        value={brand} // Нужно создать соответствующий state
                        onChange={(e) => setBrand(e.target.value)} 
                    />
                    <textarea 
                        placeholder="Описание товара" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required >
                        <option value="">Выберите категорию</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}-/-{cat.collection}
                            </option>
                        ))}
                    </select>
                    <input type="number" placeholder="Количество" value={stock} onChange={(e) => setStock(e.target.value)}/>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={isHit}
                                onChange={(e) => setIsHit(e.target.checked)}
                            />
                            Хит
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={isNew}
                                onChange={(e) => setIsNew(e.target.checked)}
                            />
                            Новинка
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={isSale}
                                onChange={(e) => setIsSale(e.target.checked)}
                            />
                            Акция
                        </label>
                    </div>
                    <div className="select__images">
                        <h4>Картинки</h4>
                        {images.map((img, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <input 
                                    value={img} 
                                    placeholder="ссылка" 
                                    onChange={(e) => updateImage(i, e.target.value)} 
                                    style={{ flex: 1, marginRight: '8px' }}
                                />
                                <div style={{ width: '50px', height: '50px', border: '1px solid #ddd' }}>
                                    {img ? (
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}${img.startsWith("/") ? "" : "/uploads/"}${img}`}
                                            alt="Выбранное изображение"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            background: '#f5f5f5',
                                            color: '#999'
                                        }}>
                                            Нет фото
                                        </div>
                                    )}
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setSelectedImageIndex(i); // Запоминаем индекс редактируемого изображения
                                        setProductOverlay(true);
                                    }}
                                    style={{ marginLeft: '8px' }}
                                >
                                    Выбрать
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => {
                            addImage(); // Добавляем новое пустое поле
                            setSelectedImageIndex(images.length); // Устанавливаем индекс на новое изображение
                            setProductOverlay(true); // Открываем галерею
                        }}>
                            + Картинка
                        </button>
                    </div>
                    <div>
                        <h4>Размеры</h4>
                        {sizes.map((s, i) => (
                            <input key={i} value={s} placeholder="например S" onChange={(e) => updateSize(i, e.target.value)} />
                        ))}
                        <button type="button" onClick={addSize}>+ Размер</button>
                    </div>

                    <div>
                        <h4>Цвета</h4>
                        {colors.map((c, i) => (
                            <input key={i} type="color" value={c} onChange={(e) => updateColor(i, e.target.value)} />
                        ))}
                        <button type="button" onClick={addColor}>+ Цвет</button>
                    </div>
                                    <button type="submit">Добавить</button>
                </form>
            </div>
            {categoryOverlay && (
                <div className="overlay" style={{
                    position: 'fixed',
                    zIndex: 10,
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    background: '#424242',
                    color: "#e0e0e0"
                }}>
                    <div className="overlay-content">
                        <h2>Выберите изображение</h2>
                        <button onClick={() => setCategoryOverlay(false)} className="close-btn">Закрыть</button>
                        <div className="image-grid" style={{ display: "flex" }}>
                            {allImages.map((img) => (
                                <div className="image__grid-wrapper" key={img.id} style={{ cursor: 'pointer', maxWidth: 150 }}>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}${img.filepath}`}
                                        alt={img.filepath}
                                        onClick={() => selectCategoryImage(img.filepath)}
                                        style={{ width: '100%', borderRadius: 8, border: '2px solid #ccc' }}
                                    />
                                </div> 
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {productOverlay && (
                <div className="overlay" style={{
                    position: 'fixed',
                    zIndex: 10,
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    background: '#424242',
                    color: "#e0e0e0",
                    overflowY: 'auto',
                    padding: '20px'
                }}>
                    <div className="overlay-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2>Выберите изображение</h2>
                            <button 
                                onClick={() => {
                                    setProductOverlay(false);
                                    setSelectedImageIndex(null);
                                }} 
                                className="close-btn"
                                style={{
                                    padding: '8px 16px',
                                    background: '#ff4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Закрыть
                            </button>
                        </div>
                        <div className="image-grid" style={{ 
                            display: "grid",
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '16px'
                        }}>
                            {allImages.map((img) => (
                                <div 
                                    key={img.id} 
                                    style={{ 
                                        cursor: 'pointer',
                                        position: 'relative',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: images.includes(img.filepath) ? '2px solid #4CAF50' : '2px solid #ccc'
                                    }}
                                    onClick={() => selectProductImage(img.filepath)}
                                >
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}${img.filepath}`}
                                        alt={img.filepath}
                                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                    />
                                    {images.includes(img.filepath) && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            background: '#4CAF50',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px'
                                        }}>
                                            ✓
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div className="comment__moders">
                {/* 🔹 НАЧАЛО: Переключение вкладок админки */}
                <div style={{ marginTop: "40px", borderBottom: "1px solid #ccc" }}>
                    <button 
                        onClick={() => setActiveTab("products")}
                        style={{ 
                            padding: "10px 20px", 
                            marginRight: "10px", 
                            backgroundColor: activeTab === "products" ? "#007bff" : "#f0f0f0",
                            color: activeTab === "products" ? "white" : "black",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Товары
                    </button>
                    <button 
                        onClick={() => setActiveTab("categories")}
                        style={{ 
                            padding: "10px 20px", 
                            marginRight: "10px", 
                            backgroundColor: activeTab === "categories" ? "#007bff" : "#f0f0f0",
                            color: activeTab === "categories" ? "white" : "black",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Категории
                    </button>
                    <button 
                        onClick={() => setActiveTab("comments")}
                        style={{ 
                            padding: "10px 20px", 
                            backgroundColor: activeTab === "comments" ? "#007bff" : "#f0f0f0",
                            color: activeTab === "comments" ? "white" : "black",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Модерация комментариев ({comments.length})
                    </button>
                </div>
                {/* 🔹 КОНЕЦ: Переключение вкладок админки */}

                {/* 🔹 НАЧАЛО: Вкладка модерации комментариев */}
                {activeTab === "comments" && (
                    <div style={{ marginTop: "20px" }}>
                        <h2>Комментарии на модерации</h2>
                        {comments.length === 0 ? (
                            <p>Нет комментариев для модерации. Отличная работа!</p>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Товар</th>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Автор</th>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Текст</th>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Дата</th>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comments.map((comment) => (
                                        <tr key={comment.id}>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {comment.Product?.nameProd || "Товар удален"}
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {comment.User ? comment.User.name : comment.guestName}
                                                <br />
                                                <small style={{ color: "gray" }}>
                                                    ({comment.User ? "Пользователь" : "Гость"})
                                                </small>
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {comment.User ? comment.User.email : comment.guestEmail}
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px", maxWidth: "300px" }}>
                                                {comment.text}
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                <button
                                                    onClick={() => handlePublishComment(comment.id)}
                                                    style={{
                                                        padding: "5px 10px",
                                                        marginRight: "5px",
                                                        backgroundColor: "#4CAF50",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "3px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Опубликовать
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    style={{
                                                        padding: "5px 10px",
                                                        backgroundColor: "#ff4444",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "3px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                {/* 🔹 КОНЕЦ: Вкладка модерации комментариев */}
            </div>
        </div>
    );
};

export default AdminPage;
