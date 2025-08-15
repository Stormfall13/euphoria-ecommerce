import React, { useState, useEffect } from 'react';

import noPhoto from '../assets/no-photo.png';

const ForMen = () => {

    const blockCardParam = {
        hidden: false,
        blockName: 'Categories For Men',
    }

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/categories`)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Ошибка загрузки категорий", err));
    }, []);
    
    
    return (
        <>
        {blockCardParam.hidden ? ('') : (
            <section className='man__category-list'>
                <p className='man__title'>{blockCardParam.blockName}</p>
                <div className="man__category-wrapp">
                    {categories.map(items => (
                        items.collection === 'man' ? (
                            <a href={`/category/${items.id}`} 
                                className="category__wrapper" 
                                key={items.id}>
                                <div className="category__img">
                                    <img 
                                    src={items.image ? `${process.env.REACT_APP_API_URL}${items.image}` : noPhoto} 
                                    alt="category image"/>
                                </div>
                                <p className="category__name">{items.name}</p>
                                <p className="category__description">{items.description}</p>
                            </a>
                        ) : (
                            ''
                        )
                    ))}
                </div>
            </section>
        )}
        </>
    )
}

export default ForMen;
