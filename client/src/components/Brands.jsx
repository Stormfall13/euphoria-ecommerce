import React from 'react';

import brand1 from '../assets/brand1.png';
import brand2 from '../assets/brand2.png';
import brand3 from '../assets/brand3.png';
import brand4 from '../assets/brand4.png';
import brand5 from '../assets/brand5.png';

import '../scss/brands.css';

const brandsData = {
    title: 'Top Brands Deal',
    text: 'Up To 60% off brands',
    img: [
        {
            id: 1,
            image: brand1,
            imageLink: '#'
        },
        {
            id: 2,
            image: brand2,
            imageLink: '#'
        },
        {
            id: 3,
            image: brand3,
            imageLink: '#'
        },
        {
            id: 4,
            image: brand4,
            imageLink: '#'
        },
        {
            id: 5,
            image: brand5,
            imageLink: '#'
        },
    ]
}

const Brands = () => {

  return (
    <section className='brands'>
        <p className="brand__title">{brandsData.title}</p>
        <p className='brand__text'>{brandsData.text}</p>
        <div className="brand__img-wrapp">
            {brandsData.img.map(items => (
                <a href={items.imageLink} className="brand__img" key={items.id}>
                    <img src={items.image} alt="brand img" />
                </a>
            ))}
        </div>
    </section>
  )
}

export default Brands
