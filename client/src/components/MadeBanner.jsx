import React from 'react';

import bbanner21 from '../assets/bbanner21.webp';
import bbanner22 from '../assets/bbanner22.webp';

import '../scss/madeBanner.css';

const madeBannerData = [
    {
        id: 1,
        title: 'WE MADE YOU EVERYDAY FASHION BETTER!',
        img: bbanner21,
        text: 'In our journey to improve everyday fashion, euphoria presents EVERYDAY wear range - Comfortable & Affordable fashion 24/7',
        link: '#',
        textLink: 'Shop Now',
        bannerContent: true,
    },
    {
        id: 2,
        title: '',
        img: bbanner22,
        text: '',
        link: '#',
        textLink: '',
        bannerContent: false,
    },
]

const MadeBanner = () => {
  return (
    <section className='made__banner'>
        {madeBannerData.map(items => (
            <div className="banner__wrapp" key={items.id}>
                <div className="banner__img">
                    <img src={items.img} alt="banner img" />
                </div>
                {items.bannerContent ? (
                    <div className="banners__content-wrapp">
                        <p className="banner__title">{items.title}</p>
                        <p className="banner__text">{items.text}</p>
                        <a className='banner__link' href={items.link}>{items.textLink}</a>
                    </div>
                ) : ('')}
            </div>
        ))}
    </section>
  )
}

export default MadeBanner;
