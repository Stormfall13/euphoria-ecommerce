import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryById } from "../store/slices/categorySlice";
import { fetchProductsByCategory } from "../store/slices/productsSlice";
import { fetchFavorites, toggleFavoriteLocally } from "../store/slices/favoriteSlice";
import { setInitialQuantities } from "../store/slices/quantitySlice";
import useMediaQuery from '../components/useMediaQuery';
import CategoryPageContent from "../components/CategoryPageContent";

import noPhoto from "../assets/no-photo.png";
import filter from '../assets/filter.svg';
import filterMenuArrowRight from '../assets/filter-menu-arrow-right.svg';
import filterArrowOpenClose from '../assets/filter-arrow-open-close.svg';
import heartCardBrown from '../assets/heart-card-brown.svg';
import heartCardWhite from '../assets/heart-card-white.svg';

import '../scss/categoryPage.css';


const CategoryPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const category = useSelector(state => state.category.data);
    const products = useSelector(state => state.products.list);
    const favoriteIds = useSelector(state => state.favorites.ids);
    
    const [categories, setCategories] = useState([]);

    // 🔹 СОСТОЯНИЯ ДЛЯ ФИЛЬТРОВ
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [selectedMinPrice, setSelectedMinPrice] = useState(0);
    const [selectedMaxPrice, setSelectedMaxPrice] = useState(0);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [showFilters, setShowFilters] = useState(true); 
    const [activeFilter, setActiveFilter] = useState('all');

    const [filterOpened, setFilterOpened] = useState(false);
    const [openSections, setOpenSections] = useState({
        price: false,
        colors: false,
        sizes: false
      });

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    
    const isMobile = useMediaQuery("(max-width: 991px)");

    useEffect(() => {
        if (isMobile) {
            setShowFilters(false);
        } else {
            setShowFilters(true);
        }
    }, [isMobile]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/categories`)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Ошибка загрузки категорий", err));
    }, []);

    // 🔹 ВЫЧИСЛЯЕМ ДАННЫЕ ДЛЯ ФИЛЬТРОВ
    const { allColors, allSizes, maxProductPrice } = useMemo(() => {
        if (!products.length) return { allColors: [], allSizes: [], maxProductPrice: 0 };
        
        // Получаем все уникальные цвета
        const colorsSet = new Set();
        products.forEach(product => {
            if (product.colors) {
                product.colors.forEach(color => colorsSet.add(color));
            }
        });

        // Получаем все уникальные размеры
        const sizesSet = new Set();
        products.forEach(product => {
            if (product.sizes) {
                product.sizes.forEach(size => sizesSet.add(size));
            }
        });

        // Находим максимальную цену
        const maxPrice = Math.max(...products.map(p => p.price), 0);

        return {
            allColors: Array.from(colorsSet),
            allSizes: Array.from(sizesSet),
            maxProductPrice: maxPrice,
        };
    }, [products]);

    // 🔹 ИНИЦИАЛИЗАЦИЯ ФИЛЬТРОВ ПРИ ЗАГРУЗКЕ ТОВАРОВ
    useEffect(() => {
        if (maxProductPrice > 0) {
            setMinPrice(0);
            setMaxPrice(maxProductPrice);
            setSelectedMinPrice(0);
            setSelectedMaxPrice(maxProductPrice);
        }
    }, [maxProductPrice]);

    // 🔹 ФИЛЬТРАЦИЯ ТОВАРОВ
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Фильтр по цене
            const priceMatch = product.price >= selectedMinPrice && product.price <= selectedMaxPrice;
            
            // Фильтр по цветам (если цвета выбраны)
            const colorMatch = selectedColors.length === 0 || 
                (product.colors && product.colors.some(color => selectedColors.includes(color)));
            
            // Фильтр по размерам (если размеры выбраны)
            const sizeMatch = selectedSizes.length === 0 || 
                (product.sizes && product.sizes.some(size => selectedSizes.includes(size)));
            
            return priceMatch && colorMatch && sizeMatch;
        });
    }, [products, selectedMinPrice, selectedMaxPrice, selectedColors, selectedSizes]);

    const finallyFilteredProducts = useMemo(() => {
        let result = filteredProducts;
        
        if (activeFilter === 'new') {
            result = result.filter(product => product.isNew);
        } else if (activeFilter === 'recommended') {
            result = result.filter(product => product.isHit); // или product.isRecommended если есть такое поле
        }
        
        return result;
    }, [filteredProducts, activeFilter]);

    // 🔹 ОБРАБОТЧИКИ КНОПОК
    const handleFilterChange = (filterType) => {
        setActiveFilter(filterType);
    };

    // 🔹 ОБРАБОТЧИКИ ФИЛЬТРОВ
    const handlePriceRangeChange = (e) => {
        const value = parseInt(e.target.value);
        setSelectedMaxPrice(value);
    };

    const handleMinPriceChange = (e) => {
        let value = parseInt(e.target.value) || 0;
        value = Math.max(0, Math.min(value, selectedMaxPrice));
        setSelectedMinPrice(value);
    };

    const handleMaxPriceChange = (e) => {
        let value = parseInt(e.target.value) || 0;
        value = Math.min(maxPrice, Math.max(value, selectedMinPrice));
        setSelectedMaxPrice(value);
    };

    const handleColorToggle = (color) => {
        setSelectedColors(prev => 
            prev.includes(color) 
                ? prev.filter(c => c !== color)
                : [...prev, color]
        );
    };

    const handleSizeToggle = (size) => {
        setSelectedSizes(prev => 
            prev.includes(size) 
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    const handleResetFilters = () => {
        setSelectedMinPrice(0);
        setSelectedMaxPrice(maxPrice);
        setSelectedColors([]);
        setSelectedSizes([]);
    };

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

    // АВТОМАТИЧЕСКИЙ СБРОС ФИЛЬТРА
    useEffect(() => {
        if (filteredProducts.length === 0 && products.length > 0) {
          handleResetFilters();
        }
      }, [filteredProducts, products, handleResetFilters]);
    
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
        <>
            <section className="main__category">
            <div className="category__wrapp">

                <div className="filter__wrapp">
                    <div className="filter__menu-wrapp">
                        <p className="filter__title" onClick={() => setFilterOpened(prev => !prev)}>
                            Filter
                            <img src={filter} alt="filter icon" />
                        </p>
                        {filterOpened ? (
                            <>
                                <nav className="filter__menu">
                                <ul>
                                    {categories
                                    .filter(cat => cat.collection === category?.collection) // берём только из той же коллекции
                                    .map(cat => (
                                        <li key={cat.id}>
                                        <Link to={`/category/${cat.id}`}>
                                            {cat.name}
                                            <div className="filter__menu-arrow">
                                                <img src={filterMenuArrowRight} alt="menu arrow" />
                                            </div>
                                        </Link>
                                        </li>
                                    ))
                                    }
                                </ul>
                                {/* 🔹 КНОПКА ПОКАЗАТЬ/СКРЫТЬ ФИЛЬТРЫ (для мобильных) */}
                                {isMobile && (  
                                    <button onClick={() => setShowFilters(!showFilters)}
                                        className="filters__btn">
                                        {showFilters ? 'Hidden filters' : 'Show filters'}
                                    </button> 
                                )}
                                </nav>
                                {/* 🔹 ПАНЕЛЬ ФИЛЬТРОВ */}
                                <div className="filter__panel" style={{ 
                                    display: showFilters ? 'block' : 'none', 
                                }}>
                                    
                                    {/* 🔹 ФИЛЬТР ПО ЦЕНЕ */}
                                    <div className="filter__range">
                                        <h4 className="filter__title" onClick={() => toggleSection('price')}>
                                            Price 
                                            <img
                                                className={openSections.price ? '' : 'rotated'}
                                                src={filterArrowOpenClose} 
                                                alt="filter arrow"/>
                                        </h4>
                                        {openSections.price && (
                                        <div className="price__wrapp">
                                            <input
                                                type="range"
                                                min={minPrice}
                                                max={maxPrice}
                                                value={selectedMaxPrice}
                                                onChange={handlePriceRangeChange}
                                                className="input__range"
                                            />
                                            <div className="min__max">
                                                <div className="min__max-input">
                                                    <div className="currency">$</div>
                                                    <input
                                                        type="text"
                                                        value={selectedMinPrice}
                                                        onChange={handleMinPriceChange}
                                                        min={0}
                                                        max={selectedMaxPrice}
                                                    />
                                                </div>
                                                <div className="min__max-input">
                                                    <div className="currency">$</div>
                                                    <input
                                                        type="text"
                                                        value={selectedMaxPrice}
                                                        onChange={handleMaxPriceChange}
                                                        min={selectedMinPrice}
                                                        max={maxPrice}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                    </div>

                                    {/* 🔹 ФИЛЬТР ПО ЦВЕТАМ */}
                                    {allColors.length > 0 && (
                                        <div className="filter__colors">
                                            <h4 className="filter__title" onClick={() => toggleSection('colors')}>
                                                Colors
                                                <img 
                                                    className={openSections.colors ? '' : 'rotated'}
                                                    src={filterArrowOpenClose} 
                                                    alt="filter arrow"/>
                                            </h4>
                                            {openSections.colors && (
                                            <div className="color__wrapp">
                                                {allColors.map(color => (
                                                    <div key={color}>
                                                        <div 
                                                        className={`color__wrapper ${selectedColors.includes(color) ? "active" : ""}`}
                                                        style={{ backgroundColor: color }} 
                                                        title={color}
                                                        onClick={() => handleColorToggle(color)}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedColors.includes(color)}
                                                                onChange={() => handleColorToggle(color => !color)}
                                                                className="color__checkbox"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            )}
                                        </div>
                                    )}
                                    {/* 🔹 ФИЛЬТР ПО РАЗМЕРАМ */}
                                    {allSizes.length > 0 && (
                                        <div className="filter__size">
                                            <h4 className="filter__title" onClick={() => toggleSection('sizes')}>
                                                Size
                                                <img 
                                                    className={openSections.sizes ? '' : 'rotated'}
                                                    src={filterArrowOpenClose}
                                                    alt="filter arrow"/>
                                            </h4>
                                            {openSections.sizes && (
                                            <div className="size__wrapp">
                                                {allSizes.map(size => (
                                                    <div key={size} className={`size__wrapper ${selectedSizes.includes(size) ? 'select__size' : ''}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedSizes.includes(size)}
                                                            onChange={() => handleSizeToggle(size)}
                                                        />
                                                        {size}
                                                    </div>
                                                ))}
                                            </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            ''
                        )}
                    </div>

                </div>
                <div className="filtered">
                <div className="filtered__items">
                    <h1 className="prod__title">{category ? category.name : "Загрузка..."}</h1>
                    <div className="prod__filter-buttons">
                        <button 
                            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'new' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('new')}
                        >
                            New
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'recommended' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('recommended')}
                        >
                            Recommended
                        </button>
                    </div>
                </div>
                {finallyFilteredProducts.length === 0 ? (
                    // 🔹 ТОВАРЫ БЕЗ ФИЛЬТРАЦИИ
                    <div className="product__wrapp">
                        <div className="product">
                            {products.map((product) => (
                                <div key={product.id} className="wrapper__prod">
                                    <div>
                                        <div className="prod__image">
                                            <div className="prod__fav-btn">
                                                <button className="prod__fav" onClick={() => toggleFavorite(product.id)}>
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
                                                <img src={
                                                        product.images && product.images.length > 0 
                                                            ? `${process.env.REACT_APP_API_URL}${product.images[0]}`
                                                            : noPhoto 
                                                        }
                                                    alt={product.nameProd}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="prod__items">
                                        <div className="prod__name-brand">
                                            <Link className="prod__name" to={`/product/${product.id}`}>{product.nameProd}</Link>
                                            <Link className='prod__brand' to={`/brand/${product.brand}`}>{product.brand}</Link>
                                        </div>
                                        <p className="prod__price">{product.price} $</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    ) : (
                    
                    // 🔹 ОТОБРАЖАЕМ ОТФИЛЬТРОВАННЫЕ ТОВАРЫ
                    <div className="product__wrapp">
                        <div className="product">
                            {finallyFilteredProducts.map((product) => (
                                <div key={product.id} className="wrapper__prod">
                                    <div>
                                        <div className="prod__image">
                                            <div className="prod__fav-btn">
                                                <button className="prod__fav" onClick={() => toggleFavorite(product.id)}>
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
                                                <img src={
                                                        product.images && product.images.length > 0 
                                                            ? `${process.env.REACT_APP_API_URL}${product.images[0]}`
                                                            : noPhoto 
                                                        }
                                                    alt={product.nameProd}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="prod__items">
                                        <div className="prod__name-brand">
                                            <Link className="prod__name" to={`/product/${product.id}`}>{product.nameProd}</Link>
                                            <Link className='prod__brand' to={`/brand/${product.brand}`}>{product.brand}</Link>
                                        </div>
                                        <p className="prod__price">{product.price} $</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                </div>
            </div>
            <CategoryPageContent />
            </section>
            
        </>
    );
};

export default CategoryPage;