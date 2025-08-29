import React from 'react';

import bannerSmall1 from '../assets/banner-small1.webp';
import bannerSmall2 from '../assets/banner-small2.webp';

import '../scss/discount.css';

const discountCard = [
    {
        id: 1,
        img: bannerSmall1,
        titleTop: 'Low Price',
        titleMain: 'High Coziness',
        textBottom: 'UPTO 50% OFF',
        linkName: 'Explore Items',
        linkLink: '#',
    },
    {
        id: 2,
        img: bannerSmall2,
        titleTop: 'Beyoung Presents',
        titleMain: 'Breezy Summer Style',
        textBottom: 'UPTO 50% OFF',
        linkName: 'Explore Items',
        linkLink: '#',
    },
]

const Discount = () => {
  return (
    <section className='discount'>
      {discountCard.map(items => (
        <div className="discount__wrapper" key={items.id}>
            <div className="discount__text-wrapp">
                <h6 className='discount__top'>{items.titleTop}</h6>
                <h2 className='discount__main'>{items.titleMain}</h2>
                <h3 className='discount__bottom'>{items.textBottom}</h3>
                <a className='discount__link' href={items.linkLink}>
                    {items.linkName}
                </a>
            </div>
            <div className="discount__img">
                <img src={items.img} alt="banner img" />
            </div>
        </div>
      ))}
    </section>
  )
}

export default Discount;
