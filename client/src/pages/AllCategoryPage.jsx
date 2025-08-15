import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";

import noPhoto from '../assets/no-photo.png';
import HeaderMain from '../components/HeaderMain';

const AllCategoryPage = () => {

  const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/categories`)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Ошибка загрузки категорий", err));
    }, []);

  return (
    <section className='all__category'>
      <HeaderMain />
      <h1 className='page__title'>All Category</h1>
      <nav className='category__wrapp'>
        <ul>
          {categories.map((category) => (
              <li key={category.id}>
              <Link to={`/category/${category.id}`}>
              <div className='category__img'>
                  <img 
                      src={category.image ? `${process.env.REACT_APP_API_URL}${category.image}` : noPhoto}
                      alt="category image" />
              </div>
              <p className='category__name'>{category.name}</p>
              </Link>
              </li>
          ))}
          </ul>
      </nav>
    </section>
  )
}

export default AllCategoryPage
